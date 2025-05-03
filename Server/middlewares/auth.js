import jwt from "jsonwebtoken";

export const userMiddleware = async (req, res, next) => {
  const token = await req.cookies.userToken;

  if (!token) {
    return res.status(403).send("Token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

export const adminMiddleware = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.id === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
