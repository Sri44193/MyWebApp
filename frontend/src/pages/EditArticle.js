import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditArticle = () => {
    const { id } = useParams(); // ✅ Get article ID from URL
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // ✅ Fetch article data when component loads
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("No token found! Redirecting to login.");
            navigate("/");
            return;
        }

        axios.get(`http://localhost:5001/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            setTitle(res.data.title);
            setContent(res.data.content);
        })
        .catch((error) => {
            alert("Failed to load article.");
            console.error(error);
            navigate("/dashboard");
        });
    }, [id, navigate]);

    // ✅ Handle article update
    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.put(
                `http://localhost:5001/articles/${id}`,
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Article updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            alert("Failed to update article.");
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Edit Article</h2>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditArticle;
