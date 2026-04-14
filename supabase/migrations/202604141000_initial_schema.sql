-- supabase/migrations/202604141000_initial_schema.sql
-- Initial Postgres schema + RLS for the MVP.

create extension if not exists "pgcrypto";

-- Enums / types
create type public.app_role as enum ('user', 'admin');
create type public.plan_code as enum ('free', 'pro');
create type public.task_type as enum ('image_generation', 'background_removal', 'background_replacement');
create type public.task_status as enum ('queued', 'processing', 'succeeded', 'failed');
create type public.asset_kind as enum ('upload', 'generated', 'processed');
create type public.credit_entry_kind as enum ('grant', 'charge', 'refund', 'manual_adjustment');

-- Core tables
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code public.plan_code not null unique,
  name text not null,
  monthly_credits integer not null check (monthly_credits >= 0),
  max_outputs_per_task integer not null check (max_outputs_per_task > 0),
  max_concurrent_tasks integer not null check (max_concurrent_tasks > 0),
  provider_tier text not null,
  created_at timestamptz not null default now()
);

-- Baseline plans (avoid auth trigger depending on seed execution order).
insert into public.plans (code, name, monthly_credits, max_outputs_per_task, max_concurrent_tasks, provider_tier)
values
  ('free', 'Free', 40, 2, 1, 'standard'),
  ('pro', 'Pro', 600, 4, 3, 'priority')
on conflict (code) do update
set
  name = excluded.name,
  monthly_credits = excluded.monthly_credits,
  max_outputs_per_task = excluded.max_outputs_per_task,
  max_concurrent_tasks = excluded.max_concurrent_tasks,
  provider_tier = excluded.provider_tier;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan_id uuid not null references public.plans(id),
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references public.users(id) on delete cascade,
  prompt_id uuid references public.prompts(id) on delete set null,
  task_type public.task_type not null,
  status public.task_status not null default 'queued',
  provider_key text not null,
  input jsonb not null,
  output jsonb,
  failure_code text,
  failure_message text,
  credits_to_charge integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid references public.ai_tasks(id) on delete set null,
  uploaded_by uuid not null references public.users(id) on delete cascade,
  kind public.asset_kind not null,
  storage_bucket text not null,
  storage_path text not null,
  public_url text not null,
  mime_type text not null,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table public.credits_ledger (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  task_id uuid references public.ai_tasks(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  entry_kind public.credit_entry_kind not null,
  amount integer not null,
  note text,
  created_at timestamptz not null default now()
);

-- Helpers
create or replace function public.current_workspace_id()
returns uuid
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select workspace_id
  from public.users
  where id = auth.uid();
$$;

create or replace function public.current_credit_balance(target_workspace_id uuid)
returns integer
language sql
stable
as $$
  select coalesce(sum(amount), 0)::integer
  from public.credits_ledger
  where workspace_id = target_workspace_id;
$$;

create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_ai_tasks_updated_at on public.ai_tasks;
create trigger set_ai_tasks_updated_at
  before update on public.ai_tasks
  for each row execute function public.tg_set_updated_at();

-- Trigger: create workspace + user row + initial credits when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  free_plan_id uuid;
  new_workspace_id uuid;
  effective_email text;
  workspace_prefix text;
begin
  effective_email := coalesce(new.email, new.id::text);
  workspace_prefix := split_part(effective_email, '@', 1);

  select id into free_plan_id from public.plans where code = 'free';
  if free_plan_id is null then
    raise exception 'Missing required plan: free';
  end if;

  insert into public.workspaces (name, slug, plan_id)
  values (
    coalesce(new.raw_user_meta_data ->> 'workspace_name', workspace_prefix || '''s workspace'),
    replace(gen_random_uuid()::text, '-', ''),
    free_plan_id
  )
  returning id into new_workspace_id;

  insert into public.users (id, workspace_id, email, full_name)
  values (new.id, new_workspace_id, effective_email, new.raw_user_meta_data ->> 'full_name');

  insert into public.credits_ledger (workspace_id, user_id, entry_kind, amount, note)
  values (new_workspace_id, new.id, 'grant', 40, 'Free plan signup credits');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.users enable row level security;
alter table public.workspaces enable row level security;
alter table public.prompts enable row level security;
alter table public.ai_tasks enable row level security;
alter table public.assets enable row level security;
alter table public.credits_ledger enable row level security;

create policy "users can read workspace users"
  on public.users for select
  using (workspace_id = public.current_workspace_id());

create policy "users can read own workspace"
  on public.workspaces for select
  using (id = public.current_workspace_id());

create policy "workspace members can read prompts"
  on public.prompts for select
  using (workspace_id = public.current_workspace_id());

create policy "workspace members can insert prompts"
  on public.prompts for insert
  with check (
    workspace_id = public.current_workspace_id()
    and created_by = auth.uid()
  );

create policy "workspace members can read tasks"
  on public.ai_tasks for select
  using (workspace_id = public.current_workspace_id());

create policy "workspace members can insert tasks"
  on public.ai_tasks for insert
  with check (
    workspace_id = public.current_workspace_id()
    and created_by = auth.uid()
  );

create policy "workspace members can read assets"
  on public.assets for select
  using (workspace_id = public.current_workspace_id());

create policy "workspace members can insert assets"
  on public.assets for insert
  with check (
    workspace_id = public.current_workspace_id()
    and uploaded_by = auth.uid()
  );

create policy "workspace members can read credits"
  on public.credits_ledger for select
  using (workspace_id = public.current_workspace_id());

-- Grants (RLS does not grant access by itself).
grant usage on schema public to anon, authenticated;

grant select on table public.plans to anon, authenticated;

grant select on table public.users to authenticated;
grant select on table public.workspaces to authenticated;
grant select, insert on table public.prompts to authenticated;
grant select, insert on table public.ai_tasks to authenticated;
grant select, insert on table public.assets to authenticated;
grant select on table public.credits_ledger to authenticated;

grant execute on function public.current_workspace_id() to authenticated;
grant execute on function public.current_credit_balance(uuid) to authenticated;
