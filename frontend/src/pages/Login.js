import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5001/auth/login", { email, password });
            localStorage.setItem("token", res.data.token); // Store JWT
            const decoded = JSON.parse(atob(res.data.token.split(".")[1])); // Decode JWT
            localStorage.setItem("role", decoded.role); // Store Role
            navigate("/dashboard"); // Redirect to dashboard
        } catch (error) {
            alert("Invalid credentials");
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
