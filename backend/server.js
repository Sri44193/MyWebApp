require("dotenv").config();
console.log("JWT Secret:", process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // ✅ Added Helmet.js for security
const rateLimit = require("express-rate-limit"); // ✅ Added Rate Limiting
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articlesRoutes");
const { authenticateUser } = require("./middleware/authMiddleware");

const app = express();

// ✅ Security Enhancements
app.use(helmet()); // Secure headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// ✅ Apply Rate Limiting to Login Route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts. Please try again after 15 minutes.",
});

app.use("/auth/login", loginLimiter); // ✅ Apply only to login route

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);

// ✅ Protected Route
app.get("/protected", authenticateUser, (req, res) => {
    res.json({ message: "This is a protected route!", user: req.user });
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
