import "server-only";
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  REMOVE_BG_API_KEY: z.string().min(1),
  INNGEST_EVENT_KEY: z.string().min(1),
  INNGEST_SIGNING_KEY: z.string().min(1)
});

export type ServerEnv = z.infer<typeof envSchema>;

let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}
