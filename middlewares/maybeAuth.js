const jwt = require("jsonwebtoken");

module.exports = function maybeAuth(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "MYSECRETKEY");
        req.user = decoded;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};
