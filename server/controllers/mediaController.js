const { body, validationResult } = require('express-validator');
const Media = require('../models/mediaModel');
const jwt = require('jsonwebtoken');

exports.createMedia = [
    
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('fileType').isString().isLength({ min: 1 }).trim().escape(),
    body('fileSize').isInt(),

    async (req, res) => {
        try{
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const media = {
            name: req.body.name,
            fileType: req.body.fileType,
            uploadedByID: userId,
            filePath: userId + "/file_location",
            fileSize: req.body.fileSize,
        };

        console.log("SERVER RECEIVED DATA: ", media);

        try {
            const id = await Media.create(media);
            res.status(201).json({ id, ...media });
        } catch (err) {
            console.log("SERVER ERROR: ", err);
            res.status(500).json({ error: 'Database error' });
        }

        } catch (err){
            res.status(500).json({ error: 'Internal Server Error' });
        }
        
    }
];

exports.getAllMedia = async (req, res) => {
    try {
        const media = await Media.findAll();
        res.json(media);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
};

exports.getMediaById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const media = await Media.findById(id);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }
        res.json(media);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
};

exports.updateMedia = [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('fileType').isString().isLength({ min: 1 }).trim().escape(),
    body('fileSize').isInt(),

    async (req, res) => {

        try{
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;
    
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
    
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'Invalid ID' });
            }
    
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const media = {
                name: req.body.name,
                fileType: req.body.fileType,
                uploadedByID: userId,
                filePath: userId + "/file_location",
                fileSize: req.body.fileSize,
            };
    
            try {
                const existingMedia = await Media.findById(id);
                if (!existingMedia) {
                    return res.status(404).json({ error: 'Media not found' });
                }
    
                await Media.update(id, media);
                res.json({ id, ...media });
            } catch (err) {
                res.status(500).json({ error: 'Database error' });
            }

        } catch (err){
            res.status(500).json({ error: 'Internal Server Error' });
        }

       
    }
];

exports.deleteMedia = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const existingMedia = await Media.findById(id);
        if (!existingMedia) {
            return res.status(404).json({ error: 'Media not found' });
        }

        await Media.delete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
};
