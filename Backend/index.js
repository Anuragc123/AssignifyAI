const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const PORT = 3000;
const{checkForAuthCookie} = require("./middlewares/auth")
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
connectDB();
app.use(cookieParser())
app.use(checkForAuthCookie('token'))

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
