import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL || "";
const parsed = url ? new URL(url) : null;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: parsed
    ? {
        host: parsed.hostname,
        port: Number(parsed.port) || 4000,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname.slice(1),
        ssl: { rejectUnauthorized: false },
      }
    : { url: "" },
});
