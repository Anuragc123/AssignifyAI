const { Schema, model, default: mongoose } = require("mongoose");
require("./User");

const submissionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    // TODO: discuss about how to get fileID
    fileIds: [
      {
        type: String,
        required: true,
      },
    ],
    points: {
      type: Number,
      default: 100,
    },
    feedback: {
      type: String,
      default: "",
    },
    // TODO: do we need to combine date and time?
    submitDate: {
      type: Date,
      default: Date.now,
    },
    submitTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Submission = model("Submission", submissionSchema);

module.exports = Submission;
