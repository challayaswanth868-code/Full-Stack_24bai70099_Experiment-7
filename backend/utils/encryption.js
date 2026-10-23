const crypto = require("crypto");

const algorithm = "aes-256-cbc";

function getKey() {
    return Buffer.from(process.env.ENCRYPTION_KEY, "utf8");
}

function encrypt(text) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        algorithm,
        getKey(),
        iv
    );

    let encrypted = cipher.update(
        text,
        "utf8",
        "hex"
    );

    encrypted += cipher.final("hex");

    return {
        iv: iv.toString("hex"),
        encryptedData: encrypted
    };
}

function decrypt(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(
        algorithm,
        getKey(),
        Buffer.from(iv, "hex")
    );

    let decrypted = decipher.update(
        encryptedData,
        "hex",
        "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
};