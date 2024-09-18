const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.verifyAuthToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.decode(token, { complete: true });
    const user = await prisma.user.findUnique({
      where: { username: decoded.payload.username },
    });
    if (user) {
      delete user.password;
      req.user = user;
      return next();
    }

    res.status(401).json({ error: "Invalid token" });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
