import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  webServer: [
    {
      command: "node scripts/mock-supabase-auth-server.mjs",
      url: "http://127.0.0.1:54321/health",
      reuseExistingServer: true,
      timeout: 15_000
    },
    {
      command: "npm.cmd run dev",
      env: {
        ...process.env,
        NEXT_PUBLIC_APP_URL: "http://127.0.0.1:3000",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "test-service-role",
        OPENAI_API_KEY: "test-openai-key",
        REMOVE_BG_API_KEY: "test-remove-bg-key",
        INNGEST_EVENT_KEY: "test-inngest-event-key",
        INNGEST_SIGNING_KEY: "test-inngest-signing-key"
      },
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      timeout: 120_000
    }
  ]
});
