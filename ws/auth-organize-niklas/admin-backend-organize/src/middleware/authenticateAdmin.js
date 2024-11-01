const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an Admin" });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Access denied: Invalid token" });
  }
};

module.exports = authenticateAdmin;
