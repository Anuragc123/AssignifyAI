const { Schema, model, default: mongoose } = require("mongoose");
require("./User");

const submissionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // TODO: discuss about how to get fileID
    fileId: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
    },
    feedback: {
      type: String,
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
