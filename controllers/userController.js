const bcrypt = require("bcrypt");
const apiFeatures = require("../utils/apiFeatures");
const Users = require("../models/userModel");

const userController = {
  get: async (req, res) => {
    try {
      const api = new apiFeatures(Users.find(), req.query)
        .filter()
        .sort()
        .paginate();
      const users = await api.query;

      return res.json({ users });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  insert: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new Users({
        name,
        email,
        password: passwordHash,
      });

      await user.save();

      return res.json({ msg: "inserted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  profile: async (req, res) => {
    try {
      const { name, email } = req.body;

      const user = await Users.findByIdAndUpdate(req.params.id, {
        name,
        email,
      });

      return res.json({ msg: "updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  password: async (req, res) => {
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);

      await Users.findByIdAndUpdate(req.params.id, {
        password: passwordHash,
      });

      return res.json({ msg: "updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  destroy: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);

      return res.json({ msg: "deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  count: async (req, res) => {
    try {
      const api = new apiFeatures(Users.find(), req.query).filter();
      const count = await api.query.countDocuments();

      return res.json({ count });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = userController;
