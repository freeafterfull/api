const { checkSchema } = require("express-validator");
const Users = require("../../../models/userModel");

const schema = checkSchema({
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "reqiured",
    },
  },
  email: {
    trim: true,
    normalizeEmail: true,
    notEmpty: {
      errorMessage: "reqiured",
    },
    isEmail: {
      errorMessage: "email",
    },
    custom: {
      options: async (value) => {
        const user = await Users.findOne({ email: value });

        if (user) {
          throw new Error("exists");
        }

        return true;
      },
    },
  },
  password: {
    trim: true,
    notEmpty: {
      errorMessage: "reqiured",
    },
    isLength: {
      errorMessage: "min",
      options: { min: 8 },
    },
  },
  password_confirmation: {
    trim: true,
    notEmpty: {
      errorMessage: "reqiured",
    },
    isLength: {
      errorMessage: "min",
      options: { min: 8 },
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
