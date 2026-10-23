
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");
const { encrypt, decrypt } = require("../utils/encryption");

// Profile: any authenticated user
router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Profile accessed successfully",
        user: req.user
    });
});

// Admin-only route
router.get(
    "/admin",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => {
        res.json({
            message: "Admin dashboard accessed successfully",
            user: req.user
        });
    }
);

// Editor and Admin
router.get(
    "/editor",
    authenticateToken,
    authorizeRole("admin", "editor"),
    (req, res) => {
        res.json({
            message: "Editor dashboard accessed successfully",
            user: req.user
        });
    }
);

// Viewer, Editor and Admin: read-only access
router.get(
    "/viewer",
    authenticateToken,
    authorizeRole("admin", "editor", "viewer"),
    (req, res) => {
        res.json({
            message: "Viewer page accessed successfully",
            access: "Read-only",
            user: req.user
        });
    }
);

// Existing user route
router.get(
    "/user",
    authenticateToken,
    authorizeRole("user", "admin"),
    (req, res) => {
        res.json({
            message: "User route accessed successfully",
            user: req.user
        });
    }
);

// Encrypt text: authenticated users
router.post("/encrypt", authenticateToken, (req, res) => {
    try {
        const { text } = req.body;

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                message: "Please provide text to encrypt"
            });
        }

        const encrypted = encrypt(text);
        res.json({ encrypted });
    } catch (error) {
        res.status(500).json({
            message: "Encryption failed",
            error: error.message
        });
    }
});

// Decrypt text: Admin only
router.post(
    "/decrypt",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => {
        try {
            const { text } = req.body;

            if (typeof text !== "string" || !text.trim()) {
                return res.status(400).json({
                    message: "Please provide encrypted text"
                });
            }

            const decrypted = decrypt(text);
            res.json({ decrypted });
        } catch (error) {
            res.status(400).json({
                message: "Decryption failed. Check the encrypted text and key."
            });
        }
    }
);

module.exports = router;
