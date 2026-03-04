const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const path = require("path");

const dbPath = path.join(__dirname, "data", "snake.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erreur ouverture DB:", err.message);
    } else {
        console.log("Connecté à la base SQLite :", dbPath);
    }
});
// 🔹 GET difficulté
app.get("/difficulty/:name", (req, res) => {
    db.get(
        "SELECT * FROM difficulties WHERE name = ?",
        [req.params.name],
        (err, row) => {
            if (err) return res.status(500).json(err);
            res.json(row);
        }
    );
});

// 🔹 POST score
app.post("/score", (req, res) => {
    const { playerName, score, difficulty } = req.body;

    db.get(
        "SELECT id FROM difficulties WHERE name = ?",
        [difficulty],
        (err, row) => {
            if (err || !row) return res.status(400).json({ error: "Invalid difficulty" });

            db.run(
                "INSERT INTO leaderboard (player_name, score, difficulty_id) VALUES (?, ?, ?)",
                [playerName, score, row.id],
                function (err) {
                    if (err) return res.status(500).json(err);
                    res.json({ success: true });
                }
            );
        }
    );
});

// 🔹 GET leaderboard
app.get("/leaderboard/:difficulty", (req, res) => {
    db.all(`
        SELECT player_name, score, created_at
        FROM leaderboard
        WHERE difficulty_id = (
            SELECT id FROM difficulties WHERE name = ?
        )
        ORDER BY score DESC
        LIMIT 10
    `, [req.params.difficulty], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.listen(3000,"0.0.0.0", () => {
    console.log("Server running on http://localhost:3000");
});