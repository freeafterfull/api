const router = require("express").Router();
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });

router.use("/auth", require("./authRouter"));
router.use("/user", auth, require("./userRouter"));

module.exports = router;
