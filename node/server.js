// Importa i moduli necessari
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Crea una nuova app express
const app = express();

// Middleware per il parsing del body in formato JSON
app.use(express.json());
app.use(cors());

// Configura la connessione al database MySQL
const db = mysql.createConnection({
    host: 'localhost', // Cambia se necessario
    user: 'root', // Cambia con il tuo utente MySQL
    password: '', // Cambia con la tua password MySQL
    database: 'gtav_db' // Cambia con il tuo database
});

// Connessione al database
db.connect(err => {
    if (err) {
        console.error('Errore di connessione al database:', err);
        return;
    }
    console.log('Connessione al database MySQL riuscita!');
});

// Imposta la porta su cui il server ascolterà
const port = 3000;

// Imposta una route di base
app.get('/ciao', (req, res) => {
    res.send('Ciao, benvenuto nel tuo server Node.js!');
});

// Route POST per creare un nuovo utente
app.post('/registrazione', (req, res) => {
    const { nome, email, password } = req.body;
    
    if (!nome || !email || !password) {
        return res.status(400).json({ errore: 'Tutti i campi sono obbligatori' });
    }

    const sql = 'INSERT INTO gta_loginUsers (nome, email, password) VALUES (?, ?, ?)';
    db.query(sql, [nome, email, password], (err, result) => {
        if (err) {
            console.error("Errore durante l'inserimento dell'utente:", err);
            return res.status(500).json({ errore: 'Errore del server' });
        }
        console.log(`Nuovo utente inserito con ID: ${result.insertId}`);
        res.status(201).json({ messaggio: 'Utente creato con successo', id: result.insertId });
    });
});

// Fai partire il server
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
