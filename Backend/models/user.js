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
        ref: "team",
      },
    ],
  },
  { timestamps: true }
);

// userSchema.pre("save", function (next) {
//   const user = this;
//   if (!user.isModified("password")) return;

//   const salt = randomBytes(16).toString();
//   const hashedPassword = createHmac("sha512", salt)
//     .update(user.password)
//     .digest("hex");

//   this.salt = salt;
//   this.password = hashedPassword;

//   next();
// });

// userSchema.static(
//   "matchPassordAndGenerateToken",
//   async function (email, password) {
//     const user = await this.findOne({ email });
//     if (!user) throw new Error("User not found");

//     const salt = user.salt;
//     const hashePassword = user.password;

//     const userProvidedHash = createHmac("sha256", salt)
//       .update(password)
//       .digest("hex");

//     if (userProvidedHash !== hashePassword)
//       throw new Error("Incorrect Password");

//     const token = createTokenForUser(user);
//     return token;
//   }
// );

const User = model("user", userSchema);

module.exports = User;
