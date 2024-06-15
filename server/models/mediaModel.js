const db = require('../config/db');

class Media {
    static async create(media) {
        const [result] = await db.execute(
            'INSERT INTO Media (Name, FileType, UploadedByID, FilePath, FileSize) VALUES (?, ?, ?, ?, ?)',
            [media.name, media.fileType, media.uploadedByID, media.filePath, media.fileSize]
        );
        return result.insertId;
    }

    static async findAll(userId) {
        const [rows] = await db.execute('SELECT * FROM Media WHERE uploadedByID = ?', [userId]);
        return rows;
    }

    static async findById(id, userId) {
        const [rows] = await db.execute('SELECT * FROM Media WHERE ID = ? AND uploadedByID = ?', [id, userId]);
        return rows[0];
    }

    static async update(id, media) {
        await db.execute(
            'UPDATE Media SET Name = ?, FileType = ?, UploadedByID = ?, FilePath = ?, FileSize = ? WHERE ID = ?',
            [media.name, media.fileType, media.uploadedByID, media.filePath, media.fileSize, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM Media WHERE ID = ?', [id]);
    }
}

module.exports = Media;
