
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

// Demo accounts for FS Experiment 7.1
const users = [
    {
        id: 1,
        username: "admin",
        password: bcrypt.hashSync("admin123", 10),
        role: "admin"
    },
    {
        id: 2,
        username: "editor",
        password: bcrypt.hashSync("editor123", 10),
        role: "editor"
    },
    {
        id: 3,
        username: "viewer",
        password: bcrypt.hashSync("viewer123", 10),
        role: "viewer"
    },
    {
        id: 4,
        username: "user",
        password: bcrypt.hashSync("user123", 10),
        role: "user"
    }
];

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const user = users.find(
        u => u.username === username.trim()
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return res.status(500).json({
            message: "JWT_SECRET is missing in .env"
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        secret,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

module.exports = router;
