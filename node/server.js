// Importa i moduli necessari
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const crypto = require('crypto');


// Funzione per generare un codice alfanumerico casuale (es. 10 caratteri)
function generaCartaIdentita() {
    return crypto.randomBytes(5).toString('hex').toUpperCase(); // 10 caratteri esadecimali
}



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

        const userId = result.insertId;
        const cartaIdentita = generaCartaIdentita();

        const query = `
            INSERT INTO gta_documents (id, carta_identita)
            VALUES (?, ?)
        `;

        db.query(query, [userId, cartaIdentita], (err2, results) => {
            if (err2) {
                console.error("Errore durante l'inserimento della carta:", err2);
                return res.status(500).json({ errore: 'Errore durante la creazione della carta di identità' });
            }

            console.log(`Utente ${nome} registrato con carta ${cartaIdentita}`);
            return res.status(201).json({
                messaggio: 'Utente creato con successo',
                id: userId,
                carta_identita: cartaIdentita
            });
        });
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

// Route GET per ottenere i dati delle impostazioni utente
app.get('/get-settings', (req, res) => {
    const { id, name } = req.query;

    if (!id || !name) {
        return res.status(400).json({ errore: 'ID e nome sono obbligatori!' });
    }

    const sqlSelect = 'SELECT gender, nationality, birthdate, height FROM gta_loginUsers WHERE id = ? AND nome = ?';

    db.query(sqlSelect, [id, name], (err, results) => {
        if (err) {
            console.error("Errore durante il recupero dei dati:", err);
            return res.status(500).json({ errore: 'Errore del server durante il recupero' });
        }

        if (results.length === 0) {
            return res.status(404).json({ errore: 'Utente non trovato' });
        }

        res.status(200).json(results[0]);
    });
});

app.post('/add_documets/:id', (req, res) => {
    const userId = req.params.id; // ID dell'utente
    const { patente_A, patente_B, patente_C } = req.body;

    // 1. Verifica se l'utente ha già un record nella tabella gta_documents
    const checkUserQuery = 'SELECT * FROM gta_documents WHERE id = ?';
    db.query(checkUserQuery, [userId], (err, results) => {
        if (err) {
            console.error("Errore durante il controllo dei documenti:", err);
            return res.status(500).json({ errore: 'Errore nel controllo dei documenti' });
        }

        // Se il record esiste già, fai un UPDATE
        if (results.length > 0) {
            const updateQuery = `
                UPDATE gta_documents
                SET patente_A = ?, patente_B = ?, patente_C = ?
                WHERE id = ?
            `;
            const updateValues = [
                patente_A ?? null, // Imposta su null se non fornito
                patente_B ?? null,
                patente_C ?? null,
                userId // ID dell'utente
            ];

            db.query(updateQuery, updateValues, (err, results) => {
                if (err) {
                    console.error("Errore durante l'aggiornamento dei documenti:", err);
                    return res.status(500).json({ errore: 'Errore durante l\'aggiornamento dei documenti' });
                }

                return res.status(200).json({
                    messaggio: 'Documenti aggiornati con successo',
                });
            });
        } else {
            // Se il record non esiste, fai un INSERT
            const insertQuery = `
                INSERT INTO gta_documents (id, patente_A, patente_B, patente_C)
                VALUES (?, ?, ?, ?)
            `;
            const insertValues = [
                userId, // ID dell'utente
                patente_A ?? null, // Imposta su null se non fornito
                patente_B ?? null,
                patente_C ?? null
            ];

            db.query(insertQuery, insertValues, (err, results) => {
                if (err) {
                    console.error("Errore durante l'inserimento dei documenti:", err);
                    return res.status(500).json({ errore: 'Errore durante l\'inserimento dei documenti' });
                }

                return res.status(201).json({
                    messaggio: 'Documenti inseriti con successo',
                });
            });
        }
    });
});

app.post('/elimina_patente/:id', (req, res) => {
    const userId = req.params.id;  // Ottieni l'ID dell'utente dalla route
    const { patente_A, patente_B, patente_C } = req.body;  // Ottieni i valori delle patenti dal corpo della richiesta

    // Query SQL per aggiornare le patenti
    const query = `
        UPDATE gta_documents
        SET 
            patente_A = ?, 
            patente_B = ?, 
            patente_C = ?
        WHERE id = ?;
    `;

    // Valori da passare alla query
    const values = [patente_A, patente_B, patente_C, userId];

    // Esegui la query
    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Errore durante l'aggiornamento:", err);
            return res.status(500).json({ errore: 'Errore durante l\'eliminazione della patente' });
        }

        return res.status(200).json({
            success: true,
            messaggio: 'Patente eliminata con successo'
        });
    });
});


// Route GET per ottenere i dati della carta d'identità
// Recupera la carta di identità per un determinato utente
app.get('/carta-identita/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT carta_identita FROM gta_documents WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Errore durante il recupero della carta di identità:", err);
            return res.status(500).json({ errore: 'Errore nel recupero della carta di identità' });
        }

        if (results.length === 0) {
            return res.status(404).json({ errore: 'Carta di identità non trovata per questo utente' });
        }

        return res.status(200).json({
            messaggio: 'Carta di identità recuperata con successo',
            carta_identita: results[0].carta_identita
        });
    });
});

// Route GET per ottenere i dati della patente
// Recupera la carta di identità per un determinato utente
app.get('/patente/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT patente_A,patente_B,patente_C FROM gta_documents WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Errore durante il recupero della carta di identità:", err);
            return res.status(500).json({ errore: 'Errore nel recupero della carta di identità' });
        }

        if (results.length === 0) {
            return res.status(404).json({ errore: 'Carta di identità non trovata per questo utente' });
        }

        return res.status(200).json({
            messaggio: 'Patenete recuperata con successo',
            patente_A: results[0].patente_A,
            patente_B: results[0].patente_B, 
            patente_C: results[0].patente_C
        });
    });
});


// Fai partire il server
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
