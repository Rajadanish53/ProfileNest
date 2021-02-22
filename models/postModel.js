const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 40,
      required: true,
    },
    body: {
      type: String,
      maxlength: 150,
      required: true,
    },
    author: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    authorname: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [{ type: ObjectId }],
  },
  { timestamps: true }
);

mongoose.model("Post", postSchema);
