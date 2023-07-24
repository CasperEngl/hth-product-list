import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: DATABASE_URL!,
    authToken: DATABASE_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
