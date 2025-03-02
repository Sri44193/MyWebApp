const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db");

const router = express.Router();

// ✅ User Signup Route (Debug Mode)
router.post(
    "/signup",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("role").optional().isIn(["admin", "viewer"]).withMessage("Invalid role"),
    ],
    async (req, res) => {
        console.log("🔹 Signup request received:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("❌ Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role } = req.body;
        try {
            // ✅ Check if user already exists
            const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
            console.log("🔹 Checking if user exists:", userExists.rows);

            if (userExists.rows.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            // ✅ Hash the password
            const hashedPassword = await bcrypt.hash(password, 12);
            console.log("🔹 Hashed password generated.");

            // ✅ Insert new user
            const newUser = await db.query(
                "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
                [username, email, hashedPassword, role || "viewer"]
            );

            console.log("✅ User created successfully:", newUser.rows[0]);
            res.json({ message: "User registered successfully", user: newUser.rows[0] });

        } catch (err) {
            console.error("❌ Signup error:", err);
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }
);
module.exports = router;