import mongoose from "mongoose";

//Об. схемы данных поста для BD
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String, //тип свойства
      required: true, //обзязательность
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //ссылка на модель
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true, //авто. обнов. и создание эл. схемы
  }
);

export default mongoose.model("Post", PostSchema);
