import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { registerValidator } from "./validations/auth.js";

import UserModel from "./models/User.js";

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
app.post("/auth/register", registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //ответ 400 - ошибка запроса
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); //алгорить шифрования пароля
    const hash = await bcrypt.hash(password, salt);

    //док. на пользователя
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: 30, //срок жизни токена
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.warn(err);
    res.status(500).json({
      //500 - статус ошибки
      message: "Some registration error",
    });
  }
});

//авторизация
app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "login error!",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "login error!",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: 30, //срок жизни токена
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "login error!",
    });
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server is started");
});
