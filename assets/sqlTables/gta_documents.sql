CREATE TABLE gta_documents (
    id INT PRIMARY KEY,
    carta_identita VARCHAR(50) UNIQUE,
    patente_A BOOLEAN DEFAULT FALSE,
    patente_B BOOLEAN DEFAULT FALSE,
    patente_C BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id) REFERENCES gta_loginUsers(id) ON DELETE CASCADE
);