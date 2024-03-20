const router = require("express").Router();
const verify = require("./verifyToken");

//this route is verified, that means only logged in users can access this route
router.get("/", verify, (req, res) => {
  res.send(req.user);
});


module.exports = router;
