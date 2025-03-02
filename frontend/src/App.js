import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle"; // ✅ Import EditArticle component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-article" element={<AddArticle />} />
                <Route path="/edit-article/:id" element={<EditArticle />} /> {/* ✅ Added Edit Article route */}
            </Routes>
        </Router>
    );
}

export default App;
