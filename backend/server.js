const express = require("express");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
