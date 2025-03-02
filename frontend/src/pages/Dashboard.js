import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const role = localStorage.getItem("role"); // Get user role
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("No token found! Redirecting to login.");
            navigate("/");
            return;
        }

        axios.get("http://localhost:5001/articles", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setArticles(res.data))
        .catch((error) => {
            alert("Failed to load articles");
            navigate("/");
        });
    }, [navigate]);

    return (
        <div>
            <h2>Dashboard</h2>

            {/* Admins can see Add Article Button */}
            {role === "admin" && <button onClick={() => navigate("/add-article")}>Add Article</button>}

            <ul>
                {articles.map((article) => (
                    <li key={article.id}>
                        <h3>{article.title}</h3>
                        <p>{article.content}</p>

                        {/* Admins can Edit/Delete Articles */}
                        {role === "admin" && (
                            <>
                                <button onClick={() => navigate(`/edit-article/${article.id}`)}>Edit</button>
                                <button onClick={() => handleDelete(article.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <button onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</button>
        </div>
    );
};

const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
        await axios.delete(`http://localhost:5001/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert("Article deleted successfully!");
        window.location.reload();
    } catch (error) {
        alert("Failed to delete article");
    }
};

export default Dashboard;
