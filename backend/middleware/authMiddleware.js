const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // ✅ Debugging line to check role
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Failed:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// ✅ Restrict Admin-Only Routes
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        console.log("Access Denied: User is not an Admin", req.user);
        return res.status(403).json({ message: "Access Denied. Admins only." });
    }
    next();
};

module.exports = { authenticateUser, requireAdmin };
