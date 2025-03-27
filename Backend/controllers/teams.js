const User = require("../models/User");
const Teams = require("../models/Team");
const { validateToken } = require("../services/auth");
const Team = require("../models/Team");

async function handleTeamsData(req, res) {
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
      const userData = await User.findOne({ email: user.email });

      const teamsIds = userData.teams;

      //   const teamsData = await Teams.find({ _id: { $in: teamsIds } });

      let teamsData = await Teams.find({ _id: { $in: teamsIds } })
        .populate("teacher", "name")
        .select("teamName teamPhoto users teacher createdAt");

      teamsData = teamsData.map((team) => ({
        ...team.toObject(),
        users: team.users.length,
      }));

      console.log("Teams data", teamsData);

      return res.json({
        success: true,
        teams: teamsData,
      });
    }
  }
}

async function handleTeamCreation(req, res) {
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
      const { code, teamName, teamPhoto } = req.body;

      const team = await Teams.findOne({ teamName });
      if (!team) {
        await Team.create({
          teamCode: code,
          teamName: teamName,
          teacher: user.id,
          teamPhoto: teamPhoto,
        });

        return res.json({ teamCreated: true });
      } else {
        return res.json({
          teamCreated: false,
          error: "Team with Same name exists",
        });
      }
    }
  }
}

async function handleTeamJoin(req, res) {
  const tokenId = req.cookies?.tokenId;

  if (!tokenId) {
    return res.json({ success: false, error: "Not LoggedIn", StatusCode: 401 });
  } else {
    const user = validateToken(tokenId);

    if (!user) {
      return res.json({
        success: false,
        error: "Not LoggedIn",
        StatusCode: 401,
      });
    } //
    else {
      const { joinCode } = req.body;

      const team = await Teams.findOne({ teamCode: joinCode });
      if (team) {
        if (team.users.includes(user.id)) {
          return res.json({
            teamJoined: false,
            error: "Already a member",
          });
        }

        await Teams.updateOne(
          { _id: team._id },
          { $set: { users: [...team.users, user.id] } }
        );

        await User.updateOne({ _id: user.id }, { $push: { teams: team._id } });

        return res.json({ teamJoined: true });
      } else {
        return res.json({
          teamJoined: false,
          error: "Invalid Join Code",
        });
      }
    }
  }
}

module.exports = {
  handleTeamsData,
  handleTeamCreation,
  handleTeamJoin,
};
