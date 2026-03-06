const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  sendWelcomeEmail,
  sendAdminNewUserAlert,
  sendAdminLoginAlert,
} = require("../config/mailer");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already used" });

    const user = await User.create({ name, email, password, isAdmin: false });
    const token = signToken(user);

    // Emails (non-bloquants) - catch errors just in case
    sendWelcomeEmail(user).catch(e => console.error("Welcome email error:", e));
    sendAdminNewUserAlert(user).catch(e => console.error("Admin user alert error:", e));

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    // Alerte connexion admin (non-bloquante)
    sendAdminLoginAlert(user).catch(e => console.error("Admin login alert error:", e));

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    next(err);
  }
};