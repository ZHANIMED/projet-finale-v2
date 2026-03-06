const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const isAuth = require("../middlewares/isAuth");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", isAuth, auth.me);

module.exports = router;