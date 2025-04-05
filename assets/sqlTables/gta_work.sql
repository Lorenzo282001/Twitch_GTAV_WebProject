
CREATE TABLE gta_works (
    work_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    job_title VARCHAR(100) NOT NULL,
    company_name VARCHAR(100),
    salary DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES gta_loginUsers(id) ON DELETE CASCADE
);