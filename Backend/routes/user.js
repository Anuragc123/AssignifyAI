const express = require("express");
const fileUpload = require("express-fileupload");

const {
  handleUserSignup,
  handleUserLogin,
  handleLogout,
  checkAuth,
  getUserDetails,
  updateUserDetails,
} = require("../controllers/user");

const {
  handleTeamsData,
  handleTeamCreation,
  handleTeamJoin,
} = require("../controllers/teams");

const {
  handleAssignmentData,
  handleCreateAssignment,
  getAssignmentDetails,
  deleteAssignment,
} = require("../controllers/assignments");

const {
  handleUploadAssignment,
  handleCheckSubmission,
  handleGetFileContent,
} = require("../controllers/submission");

const router = express.Router();

router.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "./uploads/",
  })
);

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/logout", handleLogout);
router.post("/update", updateUserDetails);
router.get("/checkAuth", checkAuth);

router.get("/getTeamsData", handleTeamsData);
router.post("/createTeam", handleTeamCreation);
router.post("/joinTeam", handleTeamJoin);

router.get("/getUserData", getUserDetails);

router.get("/getAssignmentData", handleAssignmentData);
router.post("/createAssignment", handleCreateAssignment);
router.get("/assignment/:id", getAssignmentDetails);
router.delete("/assignment/:id", deleteAssignment);

router.post("/assignment/:id/submit", handleUploadAssignment);

router.get("/assignment/:id/checkSubmission", handleCheckSubmission);

// Add new route for getting file content
router.get("/assignment/file/:fileId", handleGetFileContent);

module.exports = router;
