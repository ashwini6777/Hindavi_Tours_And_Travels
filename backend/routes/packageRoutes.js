const express = require("express");
const router = express.Router();
const db = require("../config/db");


// Create a new package
router.post("/", (req, res) => {
    const { title, description, category, price, duration, destination, availability } = req.body;

    if (!title || !category || !price || !duration || !destination) {
        return res.status(400).json({ error: "All required fields must be filled" });
    }

    const sql = `INSERT INTO tour_packages (title, description, category, price, duration, destination, availability) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [title, description, category, price, duration, destination, availability], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Package created successfully", packageId: result.insertId });
    });
});

// Get all packages
router.get("/", (req, res) => {
    db.query("SELECT * FROM tour_packages", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get package by ID
router.get("/:id", (req, res) => {
    const packageId = req.params.id;
    db.query("SELECT * FROM tour_packages WHERE id = ?", [packageId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Package not found" });
        res.json(result[0]);
    });
});

// Update package
router.put("/:id", (req, res) => {
    const packageId = req.params.id;
    const { title, description, category, price, duration, destination, availability } = req.body;

    const sql = `UPDATE tour_packages SET title=?, description=?, category=?, price=?, duration=?, destination=?, availability=? WHERE id=?`;
    db.query(sql, [title, description, category, price, duration, destination, availability, packageId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Package updated successfully" });
    });
});

// Delete package
router.delete("/:id", (req, res) => {
    const packageId = req.params.id;
    db.query("DELETE FROM tour_packages WHERE id = ?", [packageId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Package deleted successfully" });
    });
});

module.exports = router;
