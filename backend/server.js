const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change si nécessaire
    password: '', // Change si nécessaire
    database: 'geo_favorites'
});

db.connect(err => {
    if (err) console.error('Erreur MySQL:', err);
    else console.log('Connecté à MySQL');
});

// Ajouter un favori
app.post('/favorites', (req, res) => {
    const { latitude, longitude, name } = req.body;
    const sql = 'INSERT INTO favorites (latitude, longitude, name) VALUES (?, ?, ?)';
    db.query(sql, [latitude, longitude, name], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, latitude, longitude, name });
    });
});

// Récupérer les favoris
app.get('/favorites', (req, res) => {
    const sql = 'SELECT * FROM favorites';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Ajouter un score
app.post('/scores', (req, res) => {
    const { player_name, score } = req.body;
    if (!player_name || score === undefined) {
        return res.status(400).json({ error: "Nom du joueur et score requis" });
    }

    const sql = 'INSERT INTO scores (player_name, score) VALUES (?, ?)';
    db.query(sql, [player_name, score], (err, result) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Score enregistré", id: result.insertId });
    });
});

// Récupérer les scores
app.get('/scores', (req, res) => {
    const sql = 'SELECT * FROM scores ORDER BY score DESC LIMIT 10';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));