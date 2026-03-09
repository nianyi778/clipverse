import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL || "";

const pool = mysql.createPool({
  uri: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// TiDB doesn't support parameterized LIMIT in prepared statements.
// drizzle-orm uses pool.execute() for SELECT queries which triggers
// server-side prepared statements. Redirect to pool.query() which
// uses textual protocol (client-side parameter interpolation).
// Using mysql2/promise so drizzle skips the .promise() wrapper
// (which would bypass instance-level patches).
pool.execute = pool.query as typeof pool.execute;

export const db = drizzle(pool, { schema, mode: "default" });

export * from "./schema";
