const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").SchemaTypes;

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new mongoose.Schema({
  photo: {
    type: String,
    default: "http://simpleicon.com/wp-content/uploads/user1.svg",
  },
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => {
      if (!emailRegex.test(value))
        throw new Error({ error: "email is not in valid format" });
    },
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  cpassword: {
    type: String,
    minlength: 6,
  },
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
});

mongoose.model("User", UserSchema);
