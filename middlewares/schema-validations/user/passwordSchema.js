const { checkSchema } = require("express-validator");
const bcrypt = require("bcrypt");
const Users = require("../../../models/userModel");

const schema = checkSchema({
  password: {
    trim: true,
    notEmpty: {
      errorMessage: "reqiured",
    },
    isLength: {
      errorMessage: "min",
      options: { min: 4 },
    },
  },
  password_current: {
    trim: true,
    notEmpty: {
      errorMessage: "reqiured",
    },
    isLength: {
      errorMessage: "min",
      options: { min: 4 },
    },
    custom: {
      options: async (value, { req }) => {
        const user = await Users.findById(req.params.id).select("+password");
        const isMatch = await bcrypt.compare(value, user.password);

        if (!isMatch) {
          throw new Error("not_match");
        }

        return true;
      },
    },
  },
  password_confirmation: {
    trim: true,
    notEmpty: {
      errorMessage: "reqiured",
    },
    isLength: {
      errorMessage: "min",
      options: { min: 4 },
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("confirmed");
        }

        return true;
      },
    },
  },
});

module.exports = schema;
