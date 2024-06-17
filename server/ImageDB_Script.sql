CREATE DATABASE IF NOT EXISTS ImageDB;

USE ImageDB;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    fileType VARCHAR(50) NOT NULL,
    uploadedByID INT NOT NULL,
    filePath VARCHAR(255) NOT NULL,
    fileSize INT NOT NULL,
    uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploadedByID) REFERENCES Users(id)
);