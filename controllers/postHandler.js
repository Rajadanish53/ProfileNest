const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");

module.exports = {
  newPost: (newPost = async (req, res) => {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) {
      return res
        .status(422)
        .json({ error: "Please Write Title And Body And Select A Image " });
    }
    try {
      const newPost = new Post({
        title,
        body,
        photo,
        author: req.foundUser,
        authorname: req.foundUser.name,
      });

      newPost
        .save()
        .then((savedpos) => {
          const {
            _id,
            title,
            body,
            photo,
            authorname,
            createdAt,
            likes,
          } = savedpos;
          const { name, _id: authorid } = savedpos.author;
          return res.status(200).json({
            post: {
              _id,
              title,
              body,
              photo,
              author: req.foundUser._id,
              createdAt,
              authorname: authorname,
              likes,
            },
          });
        })
        .catch((err) => {
          return res.status(401).json({ error: "SOMETHING WENT WRONG" });
        });
    } catch (err) {
      return res.json({ error: "Please fill both the fields correctly" });
    }
  }),
  myPost: (myPost = async (req, res) => {
    const { _id } = req.foundUser;
    Post.find({ author: _id })
      .populate("author", "name")
      .then((foundPosts) => {
        if (foundPosts.length === 0) {
          return res.status(200).json({ posts: "No posts found" });
        }
        res.status(200).json({ posts: foundPosts });
      })
      .catch((err) => {
        res.status(422).json({ error: "Something went wrong" });
      });
  }),
  allPost: (allPost = async (req, res) => {
    Post.find()
      .sort({ createdAt: -1 })
      .then((foundposts) => {
        res.status(200).json({ posts: foundposts });
      })
      .catch((err) => {
        res.status(401).json({ posts: "no posts found" });
      });
  }),
  newComment: (newcomment = (req, res) => {
    const { comment, postid } = req.body;
    if ((!comment, !postid)) {
      return res.status(422).json({ error: "Please write something" });
    }
    // comment author postid authorid
    const newcomment = new Comment({
      comment,
      author: req.foundUser.name,
      postid: postid,
      authorid: req.foundUser._id,
      authorphoto: req.foundUser.photo,
    });
    newcomment.save().then((comment) => {
      res.json({ comment: comment });
    });
  }),
  getComment: (getcomment = (req, res) => {
    const { id } = req.body;
    Comment.find({ postid: id })
      .sort({ createdAt: -1 })
      .then((data) => {
        res.json({ comments: data });
      });
  }),
  deleteComment: (deletecomment = (req, res) => {
    const { commentid } = req.body;
    Comment.findByIdAndDelete(commentid)
      .then((data) => {
        res.json({ removed: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }),
  likepost: (likepost = (req, res) => {
    const { id } = req.body;
    // Post.findByIdAndUpdate(id,{$addToSet:{likes:req.foundUser},{new:true}})
    Post.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.foundUser } },
      { new: true }
    )
      .then((newpost) => {
        res.json({ newpost });
      })
      .catch((err) => {
        res.status(422).json({ error: err });
      });
  }),
};
