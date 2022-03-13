const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const results = validationResult(req).array({ onlyFirstError: true });

  if (results.length) {
    let errors = {};

    results.forEach((result) => {
      errors = { ...errors, [result.param]: result.msg };
    });

    return res.status(400).json({ err: errors });
  } else {
    next();
  }
};

module.exports = validate;
