const express = require("express");
const router = express.Router();
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { verifyUser } = require("../controllers/AuthController");

router.get("/verify", validateTokenMiddleware, verifyUser);

module.exports = router;
