const Category = require("../models/Category");

const slugify = (s = "") =>
  s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

exports.getAll = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ categories });
};

exports.create = async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) return res.status(400).json({ message: "Name required" });

  const slug = slugify(name);
  const exists = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });
  if (exists) return res.status(409).json({ message: "Category exists" });

  // ✅ si un fichier est uploadé
  const image = req.file ? req.file.path : "";

  const category = await Category.create({
    name: name.trim(),
    slug,
    image,
  });

  res.status(201).json({ category });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const update = {};

  if (name?.trim()) {
    update.name = name.trim();
    update.slug = slugify(name);
  }

  // ✅ si un fichier est uploadé, on remplace l'image
  if (req.file) {
    update.image = req.file.path;
  }

  const category = await Category.findByIdAndUpdate(id, update, { new: true });
  if (!category) return res.status(404).json({ message: "Not found" });

  res.json({ category });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};