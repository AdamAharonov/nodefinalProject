const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const chip = req.header("x-auth-token");
  if (!chip) return res.status(401).send("access denied");

  try {
    const encrypted = jwt.verify(chip, config.get("jwtKey"));
    req.user = encrypted;
    next();
  } catch {
    res.status(400).send("invalid chip");
  }
};
