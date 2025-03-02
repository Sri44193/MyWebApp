const express = require("express");
const { authenticateUser, requireAdmin } = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

// ✅ Create a new article (Admins Only)
router.post("/", authenticateUser, requireAdmin, async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.user.userId;

    try {
        const newArticle = await db.query(
            "INSERT INTO articles (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
            [title, content, authorId]
        );
        res.json(newArticle.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating article" });
    }
});

// ✅ Get all articles (Anyone can access)
router.get("/", async (req, res) => {
    try {
        const articles = await db.query(
            "SELECT a.id, a.title, a.content, u.username as author FROM articles a JOIN users u ON a.author_id = u.id ORDER BY a.created_at DESC"
        );
        res.json(articles.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching articles" });
    }
});

// ✅ Get a single article by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const article = await db.query("SELECT * FROM articles WHERE id = $1", [id]);
        if (article.rows.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.json(article.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching article" });
    }
});

// ✅ Update an article (Admins Only)
router.put("/:id", authenticateUser, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const updatedArticle = await db.query(
            "UPDATE articles SET title = $1, content = $2 WHERE id = $3 RETURNING *",
            [title, content, id]
        );
        res.json(updatedArticle.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating article" });
    }
});

// ✅ Delete an article (Admins Only)
router.delete("/:id", authenticateUser, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM articles WHERE id = $1", [id]);
        res.json({ message: "Article deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting article" });
    }
});

module.exports = router;
