CREATE TABLE gta_veicoli (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50) NOT NULL,
    vehicle_type ENUM('car', 'motorcycle', 'truck', 'bicycle', 'boat', 'airplane') NOT NULL,
    purchase_date DATE NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES gta_loginUsers(id) ON DELETE CASCADE
);