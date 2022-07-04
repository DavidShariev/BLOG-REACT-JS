import express from "express";
import mongoose from "mongoose";
import { loginValidator, registerValidator } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";
import multer from "multer"; //загрузка картинок
import cors from "cors"; //обращение с других адрессов
import {
  UserControllers,
  PostControllers,
  CommentControllers,
} from "./controllers/index.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import fs from "fs";

const app = express();
const port = 4444;

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

//сохранение картинок
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); //позволяет читать JSON
app.use(cors()); //разрешает запросы с других сайтов
app.use("/uploads", express.static("uploads")); //проверка наличия статичных файлов (для картинок)

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

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
  "/posts/create",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostControllers.create
);

//получение всех статей
app.get("/posts", PostControllers.getAll);

//получение одной статьи
app.post("/posts/:id", PostControllers.getOne);

//удаление поста
app.delete("/posts/:id", checkAuth, PostControllers.remove);

//получить последний 5 тегов
app.get("/posts/tags", PostControllers.getLastTags);

//обнов. поста
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  PostControllers.update
);

app.post("/comment/add", checkAuth, CommentControllers.create);

app.get("/comment/:id", CommentControllers.getComments);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is started");
});
