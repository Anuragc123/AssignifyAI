const { Schema, model, default: mongoose } = require("mongoose");

// require("./Team");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    instituteName: {
      type: String,
    },

    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String || "./avatar.jpeg",
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  { timestamps: true }
);

const User = model("user", userSchema);

module.exports = User;
