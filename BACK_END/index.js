import express from "express";
import mongoose from "mongoose";
import { loginValidator, registerValidator } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";
import multer from "multer"; //загрузка картинок

import { UserControllers, PostControllers } from "./controllers/index.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";

const app = express();
const port = 4444;

//сохранение картинок
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

//подключение к БД mongoDB
mongoose
  .connect(
    "mongodb+srv://veirash:mongoDBPassword@cluster0.cikx3gt.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

app.use(express.json()); //позволяет читать JSON

//проверка наличия статичных файлов (для картинок)
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//регистрация
app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  UserControllers.register
);

//авторизация
app.post(
  "/auth/login",
  loginValidator,
  handleValidationErrors,
  UserControllers.login
);

//получение данных авторнизации (2 парам. middleware проверка доступа)
app.get("/auth/me", checkAuth, UserControllers.getMe);

//создание статьи
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostControllers.create
);

//получение всех статей
app.post("/posts", PostControllers.getAll);

//получение одной статьи
app.post("/posts/:id", PostControllers.getOne);

//удаление поста
app.delete("/posts/:id", checkAuth, PostControllers.remove);

//обнов. поста
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  PostControllers.update
);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is started");
});
