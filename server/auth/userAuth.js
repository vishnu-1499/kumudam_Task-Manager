const jwt = require("jsonwebtoken");
const userData = require("../model/user");
require("dotenv").config();
const JWT = process.env.JWT_SECRET;

const signedToken = async (payload) => {
  return jwt.sign(payload, JWT, { expiresIn: "8h" });
};

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.send({ status: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT);
    const user = await userData.findById({ _id: decoded.id });

    if (!user) return res.send({ status: false, message: "Session expired" });

    res.locals.id = user._id.toString(); 
    next();
  } catch {
    res.send({ status: false, message: "Failed to authenticate token" });
  }
};

module.exports = { signedToken, verifyToken };
