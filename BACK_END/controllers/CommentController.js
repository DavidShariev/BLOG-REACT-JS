import CommentModel from "../models/Comment.js";

export const create = async (req, res) => {
  try {
    console.log(req.body);
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.body.postId,
    });

    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Comment is not created!",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await CommentModel.find({
      post: postId,
    })
      .populate("user")
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Get comments error!",
    });
  }
};
