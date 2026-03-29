const express = require('express');
const router = express.Router();
const { getAllProperties, addProperty, getPropertyById, getOwnerProperties, deleteProperty } = require('../controllers/PropertyController');
const { validateTokenMiddleware } = require('../middleware/AuthMiddleware');
const upload = require('../middleware/UploadMiddleware');

router.get('/all', getAllProperties);
router.get('/my-properties', validateTokenMiddleware, getOwnerProperties);
router.get('/:id', getPropertyById);
router.post('/add', validateTokenMiddleware, upload.fields([
  { name: 'coverImage', maxCount: 1 }, 
  { name: 'images', maxCount: 10 }
]), addProperty);
router.delete('/:id', validateTokenMiddleware, deleteProperty);

module.exports = router;
