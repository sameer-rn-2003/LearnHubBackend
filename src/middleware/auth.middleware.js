const { verifyAccessToken } = require("../utils/token.utils");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

module.exports = authMiddleware;
