const notFoundHandler = (req, res) => {
  return res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

const errorHandler = (error, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (error?.code === 11000) {
    return res.status(409).json({ message: "Duplicate value violates a unique constraint" });
  }

  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;

  if (process.env.NODE_ENV !== "production") {
    return res.status(statusCode).json({
      message,
      stack: error.stack
    });
  }

  return res.status(statusCode).json({ message });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
