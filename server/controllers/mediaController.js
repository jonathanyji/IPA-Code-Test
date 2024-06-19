const { body, validationResult } = require('express-validator');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const Media = require('../models/mediaModel');
const { S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const User = require('../models/userModel');

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
    body('email').isEmail().normalizeEmail(),

    async (req, res) => {
        try {

            const user = await User.findUserByEmail(req.body.email);
            console.log("SDBSDB: ", user)

            const { filename, mimetype, size } = req.file;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const tmpFile = await fs.createReadStream('tmp/' + filename);

            try {
                const command = new PutObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: user.id + "/" + filename,
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
                uploadedByID: user.id,
                filePath: user.id + "/" + filename,
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
        const userEmail = req.query.userEmail;
        const user = await User.findUserByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const media = await Media.findAll(user.id);
        res.json(media);
    } catch (err) {
        console.error('Error retrieving media:', err);
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

        const media = await Media.findById(id);
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
        console.log("EROR: ", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateMedia = [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('description').isString().isLength({ min: 1 }).trim().escape(),
  
    async (req, res) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const mediaId = req.params.id;
        const media = {
          name: req.body.name,
          description: req.body.description
        };
  
        const existingMedia = await Media.findById(mediaId);
        if (!existingMedia) {
          return res.status(404).json({ error: 'Media not found' });
        }
  
        await Media.update(mediaId, media);
        res.json({ id: mediaId, ...media });
  
      } catch (err) {
        console.error('Internal Server Error:', err);
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
        const existingMedia = await Media.findById(id);
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
