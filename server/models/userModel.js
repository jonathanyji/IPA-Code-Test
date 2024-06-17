const db = require('../config/db');
const bcrypt = require('bcryptjs');

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

    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = User;