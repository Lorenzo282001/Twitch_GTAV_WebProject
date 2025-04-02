// Importa il modulo express
const express = require('express');

// Crea una nuova app express
const app = express();

// Imposta la porta su cui il server ascolterà
const port = 3000;

// Imposta una route di base
app.get('/ciao', (req, res) => {
    res.send('Ciao, benvenuto nel tuo server Node.js!');
});

// Fai partire il server
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
