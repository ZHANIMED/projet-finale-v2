const Product = require("../models/Product");

const slugify = (s) =>
  s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

exports.getAll = async (req, res, next) => {
  try {
    const { category, q, minPrice, maxPrice } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (q) filter.title = { $regex: q, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description = "", price, category, stock = 10 } = req.body;
    const image = req.file ? req.file.path : (req.body.image || "");
    const slug = slugify(title);

    const exists = await Product.findOne({ slug });
    if (exists) return res.status(409).json({ message: "Ce titre de produit existe déjà" });

    const product = await Product.create({
      title,
      slug,
      description,
      price,
      image,
      category,
      stock,
    });

    res.status(201).json({ product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Un produit avec ce slug existe déjà" });
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, stock } = req.body;

    const update = {};
    if (title) {
      update.title = title;
      const slug = slugify(title);

      // Check if duplicate slug exists on OTHER products
      const exists = await Product.findOne({ slug, _id: { $ne: id } });
      if (exists) return res.status(409).json({ message: "Un autre produit utilise déjà ce titre" });

      update.slug = slug;
    }
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = price;
    if (category !== undefined) update.category = category;
    if (stock !== undefined) update.stock = stock;

    const image = req.file ? req.file.path : req.body.image;
    if (image !== undefined) update.image = image;

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json({ product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Un autre produit possède déjà ce titre/slug" });
    }
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};