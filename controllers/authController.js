const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new Users({ name, email, password: passwordHash });

      await user.save();

      return res.json({
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({
          err: { fail: "login_failed" },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          err: { fail: "login_failed" },
        });
      }

      const refreshToken = generateRefreshToken({ id: user._id });
      const accessToken = generateAccessToken({ id: user._id });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        path: "/api/auth/refresh",
      });

      return res.json({ access_token: accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (_req, res) => {
    try {
      res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
      return res.json({
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refresh: (req, res) => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return res.status(400).json({ msg: "refresh_failed" });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            return res.status(400).json({ msg: "refresh_failed" });
          }

          const accessToken = generateAccessToken({ id: user.id });

          return res.json({ access_token: accessToken });
        }
      );
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  me: async (req, res) => {
    try {
      const user = await Users.findById(req.user._id);

      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = authController;
