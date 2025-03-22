const { Schema, model, default: mongoose } = require("mongoose");


const assignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
      required: true,
    },
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "submission",
      },
    ],
    // TODO: need to confirm this
    dueDate: {
      type: Date,
      required: true,
    },
    dueTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Assignment = model("Assignment", assignmentSchema);

module.exports = Assignment;
