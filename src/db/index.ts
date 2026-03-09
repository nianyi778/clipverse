import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL || "";

const poolConnection = mysql.createPool({
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

export const db = drizzle(poolConnection, { schema, mode: "default" });

export * from "./schema";
