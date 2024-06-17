const db = require('../config/db');

class User {
    static async createUser(name, email) {
        try {
            const [result] = await db.execute('INSERT INTO Users (name, email) VALUES (?, ?)', [name, email]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findUserByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findUserById(id) {
        const [rows] = await db.query('SELECT name, email FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;