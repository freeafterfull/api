const router = require("express").Router();
const userController = require("../controllers/userController");
const validate = require("../middlewares/validate");
const insertSchema = require("../middlewares/schema-validations/user/insertSchema");
const profileSchema = require("../middlewares/schema-validations/user/profileSchema");
const passwordSchema = require("../middlewares/schema-validations/user/passwordSchema");

router.get("/", userController.get);
router.get("/count", userController.count);
router.post("/", insertSchema, validate, userController.insert);
router.put("/:id/profile", profileSchema, validate, userController.profile);
router.put("/:id/password", passwordSchema, validate, userController.profile);
router.delete("/:id", userController.destroy);

module.exports = router;
