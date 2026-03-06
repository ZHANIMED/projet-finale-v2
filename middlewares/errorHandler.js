module.exports = function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message);

  let status = err.statusCode || 500;
  let message = err.message || "Server error";

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Cette valeur pour '${field}' est déjà utilisée.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map(val => val.message).join(", ");
  }

  res.status(status).json({ message });
};