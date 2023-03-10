const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("You are not authorized");
    }

    const payload = jwt.verify(jwtToken, `${process.env.JWT_KEY}`);
    req.user = payload.user || "";
    req.userName = payload.userName;
  } catch (err) {
    return res.json("You are not authorized");
  }
  next();
};
