const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already used" });

  const user = await User.create({ name, email, password, isAdmin: false });
  const token = signToken(user);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
  });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
};