const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    teamCode: {
      type: String,
      required: true,
      unique: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Team = model("Team", teamSchema);

module.exports = Team;
