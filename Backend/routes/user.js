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

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/logout", handleLogout);
// router.post("/update", handleUserDetailsUpdate);
router.get("/checkAuth", checkAuth);
router.get("/getTeamsData", handleTeamsData);

router.post("/createTeam", handleTeamCreation);
router.post("/joinTeam", handleTeamJoin);

router.get('/getUserData', getUserDetails)
module.exports = router;
