require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const passport = require("passport");
const auth = require("./middlewares/auth");
const connectDB = require("./utils/database");

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Server log
app.use(morgan("[:date[clf]] :method :url :status - :response-time ms"));

// Authentication
app.use(passport.initialize());
auth(passport);

// Routes
app.use("/api", require("./routes"));

// Database connection
connectDB().catch((err) => console.log(err));

// Production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.reslove(__dirname, "public")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Server listener
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
