const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token;

    // ✅ 1️⃣ Token from COOKIE (Frontend case)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // ✅ 2️⃣ Token from Authorization header (Postman case)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({
        message: "Authorization token missing",
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

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
