const router = require("express").Router();
const ctrl = require("../controllers/category.controller");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/upload"); // ✅ à ajouter

router.get("/", ctrl.getAll);

// ✅ ajouter upload.single("image")
router.post("/", isAuth, isAdmin, upload.single("image"), ctrl.create);

// ✅ ajouter upload.single("image")
router.put("/:id", isAuth, isAdmin, upload.single("image"), ctrl.update);

router.delete("/:id", isAuth, isAdmin, ctrl.remove);

module.exports = router;