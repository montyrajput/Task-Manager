
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");


require("./config/db");


app.use(
  cors({
    origin: "https://task-manager-iota-rosy.vercel.app/", 
    credentials: true,
  })
);

app.use(express.json());


app.use("/api/auth", authRoutes); 
app.use("/api/tasks", taskRoutes); 


app.get("/health", (req, res) => res.json({ ok: true }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
