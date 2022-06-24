import { body } from "express-validator";

export const registerValidator = [
  body("email", "Неверный формат почты!").isEmail(),
  body("password", "Пароль должень быть длинее 5 символов!").isLength({
    min: 5,
  }),
  body("fullName", "Имя не может быть короче 3 символов!").isLength({ min: 3 }),
  body("avatarUrl", "Некорректная ссылка на аватар!").optional().isURL(),
];
