const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

// POST /api/orders
// Créer une commande + décrémenter le stock
router.post("/", isAuth, async (req, res, next) => {
    try {
        const { items, total, shippingAddress, phone } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Le panier est vide" });
        }

        // 1. Décrémenter le stock
        for (const item of items) {
            const product = await Product.findById(item.id || item.product);
            if (product) {
                if (product.stock < item.qty) {
                    return res.status(400).json({ message: `Stock insuffisant pour ${product.title}` });
                }
                product.stock -= item.qty;
                await product.save();
            }
        }

        // 2. Créer la commande
        const newOrder = new Order({
            user: req.user.id, // isAuth met { id, isAdmin } dans req.user
            items: items.map(x => ({
                product: x.id || x.product,
                title: x.title,
                price: x.price,
                qty: x.qty,
                image: x.image
            })),
            total,
            shippingAddress: shippingAddress || "Adresse non fournie",
            phone: phone || "Téléphone non fourni",
            status: "Validée"
        });

        await newOrder.save();

        res.status(201).json({ message: "Commande validée avec succès", order: newOrder });
    } catch (error) {
        next(error);
    }
});

// GET /api/orders/stats/sales - Statistiques de ventes par produit (Admin)
router.get("/stats/sales", isAuth, isAdmin, async (req, res, next) => {
    try {
        const salesStats = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    title: { $first: "$items.title" },
                    totalSold: { $sum: "$items.qty" },
                    revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } }
                }
            },
            { $sort: { totalSold: -1 } }
        ]);
        res.status(200).json(salesStats);
    } catch (error) {
        next(error);
    }
});

// GET /api/orders - Récupérer toutes les commandes (Admin)
router.get("/", isAuth, isAdmin, async (req, res, next) => {
    try {
        // Peupler l'utilisateur (optionnel mais utile pour le nom/email)
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});

// PUT /api/orders/:id/status - Mettre à jour le statut d'une commande (Admin)
router.put("/:id/status", isAuth, isAdmin, async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Commande introuvable" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Statut mis à jour", order });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
