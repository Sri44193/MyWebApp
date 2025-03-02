import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddArticle = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post("http://localhost:5001/articles", { title, content }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Article added successfully!");
            navigate("/dashboard");
        } catch (error) {
            alert("Failed to add article");
        }
    };

    return (
        <div>
            <h2>Add Article</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddArticle;
