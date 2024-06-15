const express = require('express');
const mediaController = require('../controllers/mediaController');

const router = express.Router();

router.post('/media', mediaController.createMedia);
router.get('/media', mediaController.getAllMedia);
router.get('/media/:id', mediaController.getMediaById);
router.put('/media/:id', mediaController.updateMedia);
router.delete('/media/:id', mediaController.deleteMedia);

module.exports = router;
