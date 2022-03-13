const { checkSchema } = require("express-validator");

const schema = checkSchema({
  email: {
    normalizeEmail: true,
    notEmpty: {
      errorMessage: "reqiured",
    },
    isEmail: {
      errorMessage: "email",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "reqiured",
    },
    isLength: {
      errorMessage: "min",
      options: { min: 4 },
    },
  },
});

module.exports = schema;
