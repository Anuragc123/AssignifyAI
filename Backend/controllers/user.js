const { createTokenForUser, validateToken } = require("../services/auth");
const User = require("../models/User");
const bcrypt = require("bcrypt");

require("dotenv").config();

async function handleUserSignup(req, res) {
  const {
    name,
    email,
    password,
    dob,
    instituteName,
    role,
    contactNo,
    profilePhoto,
  } = req.body;

  const user = await User.findOne({ email });

  console.log(password);
  if (!user) {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.saltRounds)
    );
    console.log("Signup hash=", hashedPassword);

    await User.create({
      name,
      email,
      password: hashedPassword,
      dob,
      instituteName,
      role,
      contactNo,
      profilePhoto,
    });

    // console.log("Registration attempt with:", { name, email, password });

    return res.json({ userCreated: true });
  } else {
    return res.json({
      userCreated: false,
      error: "User with Same email exists",
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      userAuthenticated: false,
      error: "Invalid Email",
    });
  } else {
    console.log("Login attempt with:", { email, password });
    const hash = await bcrypt.hash(password, parseInt(process.env.saltRounds));
    // console.log(hash);
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = createTokenForUser(user);
      res.cookie("tokenId", token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: true, // Ensures cookies are sent only over HTTPS
        sameSite: "None", // Allows cross-site cookies
      });

      return res.json({
        userAuthenticated: true,
        user: { email: user.email, name: user.name, role: user.role },
      });
    } //
    else {
      return res.json({
        userAuthenticated: false,
        error: "Invalid Password",
      });
    }
  }
}

async function handleLogout(req, res) {
  const tokenId = req.cookies?.tokenId;
  // console.log(tokenId);

  if (tokenId) {
    res.clearCookie("tokenId");
    res.clearCookie("data");
  }

  res.json({ success: true });
}

async function checkAuth(req, res) {
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
      return res.json({
        success: true,
        user: { email: user.email, name: user.name, role: user.role },
      });
    }
  }
}

async function getUserDetails(req, res) {
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
      const userData = await User.findOne({ email: user.email }).select('name email dob instituteName role contactNo profilePhoto');
      console.log(userData);
      return res.json({ success: true, user: userData });
    }
  }
}

module.exports = {
  getUserDetails,
  handleUserSignup,
  handleUserLogin,
  handleLogout,
  checkAuth,
};
