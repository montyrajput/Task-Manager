// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Import Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

// Initialize Database (runs table creation)
require("./config/db");

// --- MIDDLEWARES ---
app.use(
  cors({
    origin: "http://localhost:5173", // your React (Vite) frontend URL
    credentials: true,
  })
);

app.use(express.json());

// --- ROUTES ---
app.use("/api/auth", authRoutes); // /api/auth/register, /api/auth/login
app.use("/api/tasks", taskRoutes); // /api/tasks/...

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
