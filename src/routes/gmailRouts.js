const express = require("express");
const {
  authGmail,
  oauth2callback,
  emailList,
} = require("../controllers/gmailController");
const { verifyAuthToken } = require("../middleware/auth");

const router = express.Router();

router.get("/auth-gmail", authGmail);
router.get("/oauth2callback", oauth2callback);
router.get("/emails", verifyAuthToken, emailList);

module.exports = router;
