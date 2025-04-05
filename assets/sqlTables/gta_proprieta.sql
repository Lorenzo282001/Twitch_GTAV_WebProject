CREATE TABLE gta_proprieta (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    property_type ENUM('app', 'app_vip') NOT NULL,
    property_value DECIMAL(12,2) NOT NULL,
    address VARCHAR(255),
    description TEXT,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES gta_loginUsers(id) ON DELETE CASCADE
);