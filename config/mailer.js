const nodemailer = require("nodemailer");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zhanitmp@gmail.com";

// Transporter Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "zhanitmp@gmail.com",
    pass: process.env.EMAIL_PASS || "", // À remplir dans .env
  },
});

// Vérification des credentials pour éviter l'erreur "Missing credentials for PLAIN"
const hasCredentials = () => {
  return !!process.env.EMAIL_PASS;
};

// ────────────────────────────────────────────
// Utils
// ────────────────────────────────────────────
const logo = `<div style="font-size:28px;font-weight:900;letter-spacing:-0.5px;color:#111;margin-bottom:8px;">
  🏡 <span style="color:#c79b5b;">Eco</span>Deco
</div>`;

const wrapper = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f7f5;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.10);border:1px solid #e9e9e7;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#111 0%,#2b2b2b 100%);padding:32px 40px;">
          ${logo}
          <p style="margin:0;color:rgba(255,255,255,.75);font-size:14px;">Votre boutique de décoration premium</p>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:36px 40px;">${content}</td></tr>
        <!-- Footer -->
        <tr><td style="background:#f7f7f5;padding:24px 40px;text-align:center;border-top:1px solid #e9e9e7;">
          <p style="margin:0;font-size:12px;color:#6b7280;">© 2026 EcoDeco — Tous droits réservés</p>
          <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const badge = (text, color) =>
  `<span style="display:inline-block;background:${color};color:#fff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:800;">${text}</span>`;

// ────────────────────────────────────────────
// 1. Email de confirmation de commande → Utilisateur
// ────────────────────────────────────────────
exports.sendOrderConfirmation = async (user, order) => {
  if (!hasCredentials()) {
    console.warn("⚠️ Email confirmation non envoyé : EMAIL_PASS manquant");
    return;
  }
  try {
    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-weight:700;">${item.title || "Produit"}</span>
          <span style="color:#6b7280;font-size:13px;"> × ${item.qty}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:900;color:#c79b5b;">
          ${(item.price * item.qty).toFixed(3)} TND
        </td>
      </tr>`
      )
      .join("");

    const content = `
      <h2 style="margin:0 0 6px;font-size:26px;font-weight:900;color:#111;">✅ Commande confirmée !</h2>
      <p style="margin:0 0 24px;color:#6b7280;">Merci <strong>${user.name}</strong>, votre commande a bien été reçue.</p>

      <div style="background:#f7f7f5;border-radius:14px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:900;text-transform:uppercase;color:#6b7280;letter-spacing:.08em;">N° de commande</p>
        <p style="margin:0;font-size:20px;font-weight:900;color:#111;">#${order._id.toString().slice(-6).toUpperCase()}</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        ${itemsHtml}
        <tr>
          <td style="padding:14px 0 0;font-weight:900;font-size:16px;">TOTAL</td>
          <td style="padding:14px 0 0;text-align:right;font-weight:900;font-size:20px;color:#c79b5b;">
            ${order.total.toFixed(3)} TND
          </td>
        </tr>
      </table>

      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:16px;margin-bottom:24px;">
        <p style="margin:0;color:#166534;font-size:14px;">
          📦 <strong>Livraison :</strong> ${order.shippingAddress || "À confirmer"}<br>
          📞 <strong>Téléphone :</strong> ${order.phone || "Non renseigné"}
        </p>
      </div>

      <p style="margin:0;color:#6b7280;font-size:14px;">Nous vous tiendrons informé(e) de l'avancement de votre commande. Merci de votre confiance ! 🌿</p>
    `;

    await transporter.sendMail({
      from: `"EcoDeco 🏡" <${process.env.EMAIL_USER || "zhanitmp@gmail.com"}>`,
      to: user.email,
      subject: `✅ Commande confirmée #${order._id.toString().slice(-6).toUpperCase()} — EcoDeco`,
      html: wrapper(content),
    });
  } catch (err) {
    console.error("❌ Email confirmation commande:", err.message);
  }
};

// ────────────────────────────────────────────
// 2. Alerte commande → Admin
// ────────────────────────────────────────────
exports.sendAdminOrderAlert = async (user, order) => {
  if (!hasCredentials()) {
    console.warn("⚠️ Email alerte commande non envoyé : EMAIL_PASS manquant");
    return;
  }
  try {
    const itemsHtml = order.items
      .map(
        (item) => `<li style="margin:4px 0;">${item.qty}x <strong>${item.title}</strong> — ${(item.price * item.qty).toFixed(3)} TND</li>`
      )
      .join("");

    const content = `
      <h2 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#111;">🛒 Nouvelle commande reçue</h2>
      <p style="margin:0 0 20px;color:#6b7280;">Une commande vient d'être passée sur EcoDeco.</p>
      
      <div style="background:#fef9f0;border:1px solid #fcd34d;border-radius:14px;padding:20px;margin-bottom:20px;">
        <p style="margin:0 0 8px;"><strong>Client :</strong> ${user.name} (${user.email})</p>
        <p style="margin:0 0 8px;"><strong>Commande :</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
        <p style="margin:0 0 8px;"><strong>Total :</strong> <span style="color:#c79b5b;font-weight:900;">${order.total.toFixed(3)} TND</span></p>
        <p style="margin:0;"><strong>Livraison :</strong> ${order.shippingAddress}</p>
      </div>
      
      <p style="margin:0 0 8px;font-weight:700;">Articles commandés :</p>
      <ul style="margin:0 0 20px;padding-left:20px;color:#374151;">${itemsHtml}</ul>
    `;

    await transporter.sendMail({
      from: `"EcoDeco 🏡" <${process.env.EMAIL_USER || "zhanitmp@gmail.com"}>`,
      to: ADMIN_EMAIL,
      subject: `🛒 Nouvelle commande #${order._id.toString().slice(-6).toUpperCase()} — ${order.total.toFixed(3)} TND`,
      html: wrapper(content),
    });
  } catch (err) {
    console.error("❌ Email alerte commande admin:", err.message);
  }
};

// ────────────────────────────────────────────
// 3. Alerte stock = 0 → Admin
// ────────────────────────────────────────────
exports.sendAdminLowStockAlert = async (products) => {
  if (!hasCredentials()) {
    console.warn("⚠️ Email alerte stock non envoyé : EMAIL_PASS manquant");
    return;
  }
  try {
    const productList = products
      .map(
        (p) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #fef2f2;">
          <strong style="color:#111;">${p.title}</strong>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #fef2f2;text-align:center;">
          ${badge("STOCK ÉPUISÉ", "#ef4444")}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #fef2f2;text-align:right;color:#6b7280;font-size:13px;">
          ${p.price?.toFixed(3)} TND
        </td>
      </tr>`
      )
      .join("");

    const content = `
      <h2 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#dc2626;">⚠️ Alerte Stock Épuisé !</h2>
      <p style="margin:0 0 24px;color:#6b7280;">${products.length} produit(s) ont atteint un stock de 0 après une commande.</p>
      
      <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:14px;padding:20px;margin-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${productList}
        </table>
      </div>
      
      <p style="margin:0;color:#6b7280;font-size:14px;">⚡ Veuillez mettre à jour le stock immédiatement pour éviter de nouvelles commandes impossibles.</p>
    `;

    await transporter.sendMail({
      from: `"EcoDeco 🏡" <${process.env.EMAIL_USER || "zhanitmp@gmail.com"}>`,
      to: ADMIN_EMAIL,
      subject: `⚠️ ALERTE : ${products.length} produit(s) en rupture de stock — EcoDeco`,
      html: wrapper(content),
    });
  } catch (err) {
    console.error("❌ Email alerte stock admin:", err.message);
  }
};

// ────────────────────────────────────────────
// 4. Email bienvenue → Utilisateur (nouveau compte)
// ────────────────────────────────────────────
exports.sendWelcomeEmail = async (user) => {
  if (!hasCredentials()) {
    console.warn("⚠️ Email bienvenue non envoyé : EMAIL_PASS manquant");
    return;
  }
  try {
    const content = `
      <h2 style="margin:0 0 6px;font-size:26px;font-weight:900;color:#111;">🎉 Bienvenue sur EcoDeco !</h2>
      <p style="margin:0 0 20px;color:#6b7280;">Votre compte a été créé avec succès. Nous sommes ravis de vous accueillir, <strong>${user.name}</strong> !</p>
      
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;"><strong>📧 Email :</strong> ${user.email}</p>
        <p style="margin:0;"><strong>👤 Nom :</strong> ${user.name}</p>
      </div>

      <p style="margin:0 0 20px;color:#374151;font-size:15px;">Vous pouvez maintenant explorer notre catalogue, ajouter des articles au panier et passer vos commandes. 🌿</p>
      
      <div style="text-align:center;margin-top:28px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" 
           style="display:inline-block;background:#111;color:#fff;padding:16px 36px;border-radius:14px;font-weight:900;font-size:15px;text-decoration:none;">
          Découvrir la boutique →
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"EcoDeco 🏡" <${process.env.EMAIL_USER || "zhanitmp@gmail.com"}>`,
      to: user.email,
      subject: "🎉 Bienvenue sur EcoDeco — Compte créé avec succès",
      html: wrapper(content),
    });
  } catch (err) {
    console.error("❌ Email bienvenue:", err.message);
  }
};

// ────────────────────────────────────────────
// 5. Alerte nouveau compte → Admin
// ────────────────────────────────────────────
exports.sendAdminNewUserAlert = async (user) => {
  if (!hasCredentials()) {
    console.warn("⚠️ Email alerte nouveau compte non envoyé : EMAIL_PASS manquant");
    return;
  }
  try {
    const content = `
      <h2 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#111;">👤 Nouveau compte créé</h2>
      <p style="margin:0 0 20px;color:#6b7280;">Un nouvel utilisateur vient de s'inscrire sur EcoDeco.</p>
      
      <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:14px;padding:20px;">
        <p style="margin:0 0 8px;"><strong>Nom :</strong> ${user.name}</p>
        <p style="margin:0 0 8px;"><strong>Email :</strong> ${user.email}</p>
        <p style="margin:0;"><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"EcoDeco 🏡" <${process.env.EMAIL_USER || "zhanitmp@gmail.com"}>`,
      to: ADMIN_EMAIL,
      subject: `👤 Nouveau compte : ${user.name} — EcoDeco`,
      html: wrapper(content),
    });
  } catch (err) {
    console.error("❌ Email nouveau compte admin:", err.message);
  }
};

// ────────────────────────────────────────────
// 6. Alerte connexion → Admin
// ────────────────────────────────────────────
exports.sendAdminLoginAlert = async (user) => {
  if (!hasCredentials()) {
    console.warn("⚠️ Email non envoyé : EMAIL_PASS manquant dans .env");
    return;
  }
  try {
    const content = `
      <h2 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#111;">🔐 Connexion détectée</h2>
      <p style="margin:0 0 20px;color:#6b7280;">Un utilisateur vient de se connecter à EcoDeco.</p>
      
      <div style="background:#f5f3ff;border:1px solid #c4b5fd;border-radius:14px;padding:20px;">
        <p style="margin:0 0 8px;"><strong>Utilisateur :</strong> ${user.name}</p>
        <p style="margin:0 0 8px;"><strong>Email :</strong> ${user.email}</p>
        <p style="margin:0 0 8px;"><strong>Rôle :</strong> ${user.isAdmin ? "🔑 Administrateur" : "👤 Client"}</p>
        <p style="margin:0;"><strong>Heure :</strong> ${new Date().toLocaleString("fr-FR")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"EcoDeco 🏡" <${process.env.EMAIL_USER || "zhanitmp@gmail.com"}>`,
      to: ADMIN_EMAIL,
      subject: `🔐 Connexion : ${user.name} — EcoDeco`,
      html: wrapper(content),
    });
  } catch (err) {
    console.error("❌ Email connexion admin:", err.message);
  }
};
