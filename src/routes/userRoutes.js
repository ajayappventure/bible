const express = require("express");
const { getUserInfo } = require("../controllers/authController");
const { verifyAuthToken } = require("../middleware/auth");

const router = express.Router();

router.get("/info", verifyAuthToken, getUserInfo);

module.exports = router;
