const router = require("express").Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const loginSchema = require("../middlewares/schema-validations/loginSchema");
const insertSchema = require("../middlewares/schema-validations/user/insertSchema");

const auth = passport.authenticate("jwt", { session: false });

router.post("/register", insertSchema, validate, authController.register);
router.post("/login", loginSchema, validate, authController.login);
router.delete("/logout", authController.logout);
router.get("/refresh", authController.refresh);
router.get("/me", auth, authController.me);

module.exports = router;
