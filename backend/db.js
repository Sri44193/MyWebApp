const { Pool } = require("pg");
require("dotenv").config();

/*
const pool = new Pool({
    user: "myapp_srikanth",
    host: "localhost",
    database: "myapp_db",
    password: "password",
    port: 5432, // Default PostgreSQL port
});
*/

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // ✅ Uses Render's database URL
    ssl: {
        rejectUnauthorized: false, // ✅ Required for hosted databases
    },
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL Database"))
    .catch(err => console.error("❌ Database connection error:", err));

module.exports = pool;
