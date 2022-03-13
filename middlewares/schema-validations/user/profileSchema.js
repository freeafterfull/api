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
      options: async (value, { req }) => {
        const exists = await Users.count({ email: value });
        const ignore = await Users.count({
          $and: [{ _id: req.params.id }, { email: value }],
        });

        if (exists && !ignore) {
          throw "exists";
        }

        return true;
      },
    },
  },
});

module.exports = schema;
