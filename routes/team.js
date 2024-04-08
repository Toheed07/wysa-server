const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router
  .route("/")
  .get(teamController.getAllTeams)
  .post(teamController.createNewTeam)


router
  .route("/:id")
  .get(teamController.getTeamById)
  .delete(teamController.deleteTeamById);

module.exports = router;
