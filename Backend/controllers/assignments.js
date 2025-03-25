const User = require("../models/User");
const Teams = require("../models/Team");
const { validateToken } = require("../services/auth");
const Assignment = require("../models/assignment");
const { default: mongoose } = require("mongoose");

async function handleAssignmentData(req, res) {
  const tokenId = req.cookies?.tokenId;

  if (!tokenId) {
    return res.json({ success: false, error: "Not LoggedIn", StatusCode: 401 });
  } //
  else {
    const user = validateToken(tokenId);

    if (!user) {
      return res.json({
        success: false,
        error: "Not LoggedIn",
        StatusCode: 401,
      });
    } //
    else {
      const userData = await User.findOne({ email: user.email })
        .select("name role teams")
        .populate({
          path: "teams",
          populate: {
            path: "assignments",
          },
        });

      const assignmentsData = userData.teams.flatMap((team) =>
        team.assignments.map((assignment) => ({
          assignmentId: assignment._id,
          title: assignment.title,
          description: assignment.description,
          dueDate: new Date(assignment.dueDate).toLocaleDateString(),
          dueTime: assignment.dueTime,
          points: assignment.points,
          teamName: team.teamName,
          teamMembersCount: team.users.length,
          submissionCount: assignment.submissions.length,
        }))
      );

      console.log("assignmentsData=", assignmentsData);

      return res.json({
        success: true,
        assignments: assignmentsData,
      });
    }
  }
}

async function handleCreateAssignment(req, res) {
  const tokenId = req.cookies?.tokenId;

  if (!tokenId) {
    return res.json({ success: false, error: "Not LoggedIn", StatusCode: 401 });
  } //
  else {
    const user = validateToken(tokenId);

    if (!user) {
      return res.json({
        success: false,
        error: "Not LoggedIn",
        StatusCode: 401,
      });
    } else {
      if (user.role !== "teacher") {
        return res.json({
          success: false,
          error: "Not a teacher",
          StatusCode: 401,
        });
      }

      const { title, description, dueDate, dueTime, points, teamId } = req.body;

      const objectId = new mongoose.Types.ObjectId(teamId);

      const team = await Teams.findOne({
        _id: objectId,
      });

      if (!team) {
        return res.json({
          assignmentCreated: false,
          error: "Team not found",
        });
      }

      const assignment = await Assignment.create({
        title: title,
        description: description,
        dueDate: dueDate,
        dueTime: dueTime,
        points: points,
        team: teamId,
      });

      // console.log("assignment=", assignment);

      const teamResponse = await Teams.updateOne(
        { _id: team._id },
        { $set: { assignments: [...team.assignments, assignment._id] } }
      );

      // console.log(teamResponse);

      if (assignment && teamResponse) {
        return res.json({ assignmentCreated: true });
      } else {
        return res.json({
          assignmentCreated: false,
          error: "Error in creating assignment",
        });
      }
    }
  }
}

async function getAssignmentDetails(req, res) {
  const tokenId = req.cookies?.tokenId;

  if (!tokenId) {
    return res.json({ success: false, error: "Not LoggedIn", StatusCode: 401 });
  } //
  else {
    const user = validateToken(tokenId);

    if (!user) {
      return res.json({
        success: false,
        error: "Not LoggedIn",
        StatusCode: 401,
      });
    } else {
      const { id } = req.params;
      console.log("assignmentId=", id);
      const objectId = new mongoose.Types.ObjectId(id);

      const assignment = await Assignment.findOne({ _id: objectId }).populate(
        "team"
      );

      // console.log("assignment=", assignment);

      if (assignment) {
        const formattedAssignment = {
          id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          course: assignment.team?.teamName,
          dueDate: assignment.dueDate,
          dueTime: assignment.dueTime,
          points: assignment.points,
          status: "active",
          submissionsCount: assignment.submissions.length,
        };
        console.log("formattedAssignment=", formattedAssignment);
        return res.json({ success: true, assignment: formattedAssignment });
      }

      return res.json({ success: false, error: "Assignment not found" });
    }
  }
}

module.exports = {
  handleAssignmentData,
  handleCreateAssignment,
  getAssignmentDetails,
};
