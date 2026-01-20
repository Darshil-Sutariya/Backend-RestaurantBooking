const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
        success: false
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload",
        success: false
      });
    }

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false
    });
  }
};

module.exports = verifyToken;
