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

// Route POST per il login
app.post('/login', (req, res) => {
    const { name, password } = req.body; // Ottieni nome e password dal corpo della richiesta

    if (!name || !password) {
        return res.status(400).json({ errore: 'Nome e password sono obbligatori' });
    }

    const sql = 'SELECT id,nome, role,is_admin FROM gta_loginUsers WHERE nome = ? AND password = ?';
    db.query(sql, [name, password], (err, result) => {
        if (err) {
            console.error("Errore durante il recupero dei dati dell'utente:", err);
            return res.status(500).json({ errore: 'Errore del server' });
        }

        if (result.length === 0) {
            return res.status(404).json({ errore: 'Utente non trovato o password errata' });
        }

        res.status(200).json({
            id: result[0].id,
            nome: result[0].nome,
            role: result[0].role,
            admin: result[0].is_admin,
            messaggio: 'Login effettuato con successo'
        });

        console.log(`Login effettuato con successo per l'utente: ${result[0].nome}`);
    });
});


// Route POST per ricevere i dati delle impostazioni
app.post('/save-settings', (req, res) => {
    // Destruttura i dati inviati dal client
    const {id, name, gender, nationality, birthdate, height } = req.body;

    // Verifica che tutti i dati necessari siano presenti
    if (!gender || !nationality || !birthdate || !height) {
        return res.status(400).json({ errore: 'Tutti i campi sono obbligatori!' });
    }

    const sqlUpdate = 'UPDATE gta_loginUsers SET gender = ?, nationality = ?, birthdate = ?, height = ? WHERE id = ? AND nome = ?';

    db.query(sqlUpdate, [gender, nationality, birthdate, height, id, name], (err, result) => {
        if (err) {
            console.error("Errore durante l'aggiornamento dell'utente:", err);
            return res.status(500).json({ errore: 'Errore del server durante l\'aggiornamento' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ errore: 'Utente non trovato' });
        }

        res.status(200).json({
            messaggio: 'Settaggi Utente aggiornati con successo'
        });

        console.log(`Settaggi utente con ID ${id} NAME ${name} aggiornato con successo.`);
    });
});



// Fai partire il server
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
