CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255) NOT NULL
);

INSERT INTO messages (text) VALUES ("Acheter un cadeau d'anniversaire pour Maman");
