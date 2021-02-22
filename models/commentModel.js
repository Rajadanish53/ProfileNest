const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      maxlength: 26,
    },
    author: {
      type: String,
      required: true,
    },
    authorphoto: {
      type: String,
      required: true,
    },
    postid: {
      type: ObjectId,
      required: true,
    },
    authorid: {
      type: ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Comment", commentSchema);
