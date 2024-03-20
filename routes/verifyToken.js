const jwt = require("jsonwebtoken");
const { models } = require("mongoose");

module.exports = function verify(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden' })
  }
};
