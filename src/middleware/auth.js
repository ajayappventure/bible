const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.verifyAuthToken = async (req) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return false;
    }
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.decode(token, { complete: true });
    const user = await prisma.user.findUnique({
      where: { user_name: decoded.payload.username },
    });
    if (user) return true;
    return false;
  } catch (error) {
    return false;
  }
};
