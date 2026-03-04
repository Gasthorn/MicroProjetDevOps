const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./snake.db");
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS difficulties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            update_interval INTEGER NOT NULL,
            canvas_size INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            difficulty_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (difficulty_id) REFERENCES difficulties(id)
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO difficulties (id, name, update_interval, canvas_size)
        VALUES
        (1, 'easy', 200, 300),
        (2, 'medium', 150, 500),
        (3, 'hard', 100, 700)
    `);
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