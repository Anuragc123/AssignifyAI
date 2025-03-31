const mongoose = require("mongoose");
const BoxSDK = require("box-node-sdk");
const fs = require("fs");

// require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

const connectBox = async () => {
  try {
    const sdk = new BoxSDK({
      clientID: process.env.BOX_CLIENT_ID,
      clientSecret: process.env.BOX_CLIENT_SECRET,
    });

    const client = sdk.getBasicClient(process.env.BOX_DEVELOPER_TOKEN);

    console.log("Connected to Box");
    return client;
  } catch (error) {
    console.error("Box connection error:", error);
    process.exit(1);
  }
};

module.exports = { connectDB, connectBox };
