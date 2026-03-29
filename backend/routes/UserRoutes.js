var express = require('express');
const { login, register, toggleSavedProperty, getSavedProperties } = require('../controllers/UserController');
const { validateTokenMiddleware } = require('../middleware/AuthMiddleware');
var router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/toggle-save", validateTokenMiddleware, toggleSavedProperty);
router.get("/saved", validateTokenMiddleware, getSavedProperties);

module.exports = router;
