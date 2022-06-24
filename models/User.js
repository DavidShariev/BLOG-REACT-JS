import mongoose from "mongoose";

//Об. схемы данных пользователя для BD
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String, //тип свойства
      required: true, //обзязательность
    },
    email: {
      type: String,
      required: true,
      unique: true, //уникальность
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true, //авто. обнов. и создание эл. схемы
  }
);

export default mongoose.model("User", UserSchema);
