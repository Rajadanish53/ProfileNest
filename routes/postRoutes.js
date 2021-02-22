const requireLogin = require("../middlewares/requireLogin");
const {
  newPost,
  myPost,
  allPost,
  newComment,
  getComment,
  deleteComment,
  likepost,
} = require("../controllers/postHandler");
const express = require("express");
const Router = express.Router();

Router.post("/createpost", requireLogin, newPost);
Router.get("/mypost", requireLogin, myPost);
Router.get("/allpost", requireLogin, allPost);
Router.post("/newcomment", requireLogin, newComment);
Router.post("/getcomment", requireLogin, getComment);
Router.delete("/deletecomment", requireLogin, deleteComment);
Router.put("/likepost", requireLogin, likepost);

module.exports = Router;
