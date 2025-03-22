const { Schema, model, default: mongoose } = require("mongoose");
// require('./User')
// require('./assignment')

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
      ref: "user",
      required: true,
    },
    profilePhoto: {
      type: String,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assignment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Team = model("Team", teamSchema);

module.exports = Team;
