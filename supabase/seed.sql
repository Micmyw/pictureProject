-- supabase/seed.sql
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

