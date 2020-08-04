const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports.checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const userInfo = jwt.verify(token, SECRET_KEY);
        req.user = userInfo;
        return next();
      } catch (err) {
        return res.status(401).send("Token invalido/Expirado");
      }
    }
    return res.status(400).send("El header no esta bien formateado (Bearer <token>)");
  }
  return res.status(400).send("Debe proveer el header de autorizacion");
};

module.exports.checkRole = (role) => {
  return (req, res, next) => {
    if(req.user.role !== role) {
      return res.status(403).send("No tienes los permisos para realizar esta accion >:(")
    }
    next();
  }
} 