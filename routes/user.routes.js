const router = require("express").Router();
const User = require("../models/User");
const isAuth = require("../middlewares/isAuth");
const uploadUser = require("../middlewares/uploadUser");

router.get("/profile", isAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

router.put("/profile", isAuth, uploadUser.single("photo"), async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const update = {};

    if (name) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (address !== undefined) update.address = address;

    if (req.file) {
      update.photo = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;