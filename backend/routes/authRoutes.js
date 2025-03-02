const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db");

const router = express.Router();

// ✅ User Signup Route
router.post(
    "/signup",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("role").optional().isIn(["admin", "viewer"]).withMessage("Invalid role"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role } = req.body;
        try {
            const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
            if (userExists.rows.length > 0) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 12); // ✅ Increased security with 12 salt rounds
            const newUser = await db.query(
                "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
                [username, email, hashedPassword, role || "viewer"]
            );

            res.json({ message: "User registered successfully", user: newUser.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// ✅ User Login Route with JWT Expiration
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

            if (user.rows.length === 0) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // ✅ Token expires in 1 hour
            const token = jwt.sign(
                { userId: user.rows[0].id, role: user.rows[0].role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // ✅ Include expiration time in response
            res.json({ message: "Login successful", token, expiresIn: "1h" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router;
