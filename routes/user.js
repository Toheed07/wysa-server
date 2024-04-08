const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser);

router.route("/size").get(usersController.getUserCount);

router.route("/filters").get(usersController.getUsersByFilters);

router.route("/name/:name").get(usersController.getUsersByName);

router
  .route("/:id")
  .get(usersController.getUserById)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
