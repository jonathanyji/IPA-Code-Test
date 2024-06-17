const { body, validationResult } = require('express-validator');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const Media = require('../models/mediaModel');
const { S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const tempUserId = 3;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ASSESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});

const upload = multer({ storage: storage });

exports.createMedia = [
    upload.single('file'),
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('description').isString().isLength({ min: 1 }).trim().escape(),

    async (req, res) => {
        try {
            // const token = req.header('Authorization').replace('Bearer ', '');
            // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // const userId = decoded.userId;

            // if (!userId) {
            //     return res.status(401).json({ error: 'Unauthorized' });
            // }


            const { filename, mimetype, size } = req.file;


            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const tmpFile = await fs.createReadStream('tmp/' + filename);

            try {
                const command = new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: tempUserId + "/" + filename,
                    Body: tmpFile,
                    ContentType: mimetype,
                });

                const response = await s3Client.send(command);
                console.log(response);
            } catch (err) {
                console.error("S3 upload error: ", err);
            }

            console.log("I SEE DESCVRION: ", req.body.description);

            const media = {
                name: req.body.name,
                description: req.body.description,
                fileType: mimetype,
                uploadedByID: tempUserId,
                filePath: tempUserId + "/" + filename,
                fileSize: size,
            };

            try {
                const id = await Media.create(media);
                const filePath = 'tmp/' + filename;

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Clean up tmp folder.');
                    }
                });
                res.status(201).json({ id, ...media });
            } catch (err) {
                console.log("SERVER ERROR: ", err);
                res.status(500).json({ error: 'Database error' });
            }

        } catch (err) {
            console.log("SERVER ERROR: ", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }
];

exports.getAllMedia = async (req, res) => {
    try {
        const media = await Media.findAll(tempUserId);
        res.json(media);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getMediaById = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    let url = null;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const media = await Media.findById(id, tempUserId);
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }

        const fileLocation = media.filePath
        
        try{
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileLocation,
              });
            
              // await the signed URL and return it
            url = await getSignedUrl(s3Client, command, 3600 );
              console.log("URL: ", url)
        } catch (err) {
            console.error("S3 Get file error: ", err);
        }

        

        res.json({media, url});
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateMedia = [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('fileType').isString().isLength({ min: 1 }).trim().escape(),
    body('fileSize').isInt(),

    async (req, res) => {

        try {
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

        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }


    }
];

exports.deleteMedia = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log("DELETE api called")
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const existingMedia = await Media.findById(id, tempUserId);
        if (!existingMedia) {
            return res.status(404).json({ error: 'Media not found' });
        }

        //Delete from s3
        try {
            const fileLocation = existingMedia.filePath
            const command = new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileLocation,
            });

            const response = await s3Client.send(command);
            console.log(response);
        } catch (err) {
            console.error("S3 delete file error: ", err);
        }

        await Media.delete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
