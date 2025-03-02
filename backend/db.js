const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: "myapp_srikanth",
    host: "localhost",
    database: "myapp_db",
    password: "password",
    port: 5432, // Default PostgreSQL port
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL Database"))
    .catch(err => console.error("❌ Database connection error:", err));

module.exports = pool;
