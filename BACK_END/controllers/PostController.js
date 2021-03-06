import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";
import CommentModel from "../models/Comment.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Post is not created!",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec(); //.populate - связывает эл. из другой таблицы

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Posts not found!",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }, //увеличить просмотры
      },
      {
        returnDocument: "after", //вернуть обновленный эл.
      },
      async (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Post not found!",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Post not found!",
          });
        }

        const user = await UserModel.findOne({
          _id: doc.user._id,
        });
        doc.user = user;
        res.json(doc);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Post not Found",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Delete error!",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Post not found!",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Post not Found",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Some update error!",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    let tags = posts.map((post) => post.tags).flat();

    tags = new Set(tags);
    tags = Array.from(tags);

    res.json(tags.slice(0, 5));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Tags not found",
    });
  }
};

export const tagFilterPosts = async (req, res) => {
  try {
    const tag = req.params.tag;

    let posts = await PostModel.find().populate("user").exec();
    posts = posts.filter((post) => post.tags.includes(tag));
    console.log(posts);
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Tag filter error!",
    });
  }
};
