const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  handleLogout,
  checkAuth,
  getUserDetails,
  //   handleUserDetailsUpdate,
} = require("../controllers/user");

const {
  handleTeamsData,
  handleTeamCreation,
  handleTeamJoin,
} = require("../controllers/teams");

const { handleAssignmentData, handleCreateAssignment, getAssignmentDetails, deleteAssignment } = require("../controllers/assignments");

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/logout", handleLogout);
// router.post("/update", handleUserDetailsUpdate);
router.get("/checkAuth", checkAuth);
router.get("/getTeamsData", handleTeamsData);

router.post("/createTeam", handleTeamCreation);
router.post("/joinTeam", handleTeamJoin);

router.get("/getUserData", getUserDetails);

router.get("/getAssignmentData", handleAssignmentData);
router.post("/createAssignment", handleCreateAssignment);
router.get("/assignment/:id", getAssignmentDetails);
router.delete("/assignment/:id", deleteAssignment);
module.exports = router;
