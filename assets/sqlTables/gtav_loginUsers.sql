CREATE TABLE gta_loginUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    gender VARCHAR(255),
    nationality VARCHAR(255),
    birthdate VARCHAR(255),
    height VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'citizen',
    is_admin BOOLEAN DEFAULT FALSE
);