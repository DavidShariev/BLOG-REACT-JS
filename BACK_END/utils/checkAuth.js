import jwt from "jsonwebtoken";

//проверка прав на получение данных юзера
export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""); //принятие токена

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: "User is not login",
      });
    }
  } else {
    return res.status(403).json({
      message: "User is not login",
    });
  }
};
