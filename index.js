import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { loginValidator, registerValidator } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";

import UserModel from "./models/User.js";
import User from "./models/User.js";

import * as UserControllers from "./controllers/UserController.js";
import * as PostControllers from "./controllers/PostController.js";
import { postCreateValidation } from "./validations/post.js";

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

app.use(express.json()); //позволяет читать JSON

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//регистрация
app.post("/auth/register", registerValidator, UserControllers.register);

//авторизация
app.post("/auth/login", loginValidator, UserControllers.login);

//получение данных авторнизации (2 парам. middleware проверка доступа)
app.get("/auth/me", checkAuth, UserControllers.getMe);

//создание статьи
app.post("/post", checkAuth, postCreateValidation, PostControllers.create);

//получение всех статей
app.post("/posts", PostControllers.getAll);

//получение одной статьи
app.post("/posts/:id", PostControllers.getOne);

//удаление поста
app.delete("/posts/:id", checkAuth, PostControllers.remove);

//обнов. поста
app.patch("/posts/:id", checkAuth, PostControllers.update);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is started");
});
