const express = require('express');
const mysql = require('mysql2');
const index = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
require('dotenv').config();

index.use(cors());

// Middleware pour analyser le JSON
index.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


console.log("Attempting to connect to:", process.env.DB_HOST);

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1);
  }
  console.log('Connecté à la base de données MySQL.');
});


index.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur API !');
});


// GET: Récupère tous les messages
index.get('/api/messages', (req, res) => {
  db.query('SELECT * FROM messages', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST: Ajoute un nouveau message
index.post('/api/messages', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Le champ "text" est requis.' });
  }

  db.query('INSERT INTO messages (text) VALUES (?)', [text], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, text });
  });
});

// PUT: Met à jour un message par ID
index.put('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Le champ "text" est requis.' });
  }

  db.query('UPDATE messages SET text = ? WHERE id = ?', [text, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }
    res.json({ id, text });
  });
});

// DELETE: Supprime un message par ID
index.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM messages WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }
    res.json({ message: `Message avec l'ID ${id} supprimé.` });
  });
});

// Démarrage du serveur
index.listen(PORT, () => {
  console.log(`Back-end running on port ${PORT}`);
});
