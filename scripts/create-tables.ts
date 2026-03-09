import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL || "";

async function main() {
  const conn = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log("Connected to TiDB. Creating tables...\n");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255),
      password_hash TEXT,
      avatar_url TEXT,
      google_id VARCHAR(255) UNIQUE,
      plan ENUM('free','pro','lifetime','team') NOT NULL DEFAULT 'free',
      stripe_customer_id VARCHAR(255) UNIQUE,
      stripe_subscription_id VARCHAR(255),
      daily_downloads INT NOT NULL DEFAULT 0,
      daily_downloads_reset VARCHAR(10),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log("✓ users");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS downloads (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      url TEXT NOT NULL,
      platform VARCHAR(50) NOT NULL,
      title TEXT,
      format_id VARCHAR(50),
      quality VARCHAR(20),
      file_size VARCHAR(50),
      status ENUM('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
      error TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log("✓ downloads");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      stripe_subscription_id VARCHAR(255) NOT NULL UNIQUE,
      stripe_price_id VARCHAR(255) NOT NULL,
      status ENUM('active','canceled','past_due','incomplete','trialing','unpaid') NOT NULL,
      current_period_start VARCHAR(30),
      current_period_end VARCHAR(30),
      cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log("✓ subscriptions");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      \`key\` VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      last_used_at TIMESTAMP,
      request_count INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log("✓ api_keys");

  console.log("\nAll tables created successfully!");
  await conn.end();
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
