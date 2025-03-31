const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./db");
const cookieParser = require("cookie-parser");
const path = require("path");
const PORT = 3000;
const { checkForAuthCookie } = require("./middlewares/auth");
dotenv.config();
const app = express();

const corsOptions = {
  // origin: "https://moneyflow-frontend-one.vercel.app",
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
connectDB();
app.use(cookieParser());
app.use(checkForAuthCookie("token"));

// Set up static file serving for temporary files
const tempDir = path.join(__dirname, "temp");
app.use(
  "/temp",
  (req, res, next) => {
    // Add security headers to prevent caching
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
  },
  express.static(tempDir)
);

app.use("/user", require("./routes/user"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
