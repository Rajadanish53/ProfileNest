const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

module.exports = {
  signup: (signupHandler = async (req, res) => {
    // name email country password confirmpassword
    const { name, email, country, password, cpassword } = req.body;
    if (!name || !email || !country || !password || !cpassword) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      console.log("User allready exists");
      return res.status(405).json({ error: "User Allready Exists" });
    }
    // Hashing the password

    if (password === cpassword) {
      if (password.length < 6 || cpassword.length < 6) {
        return res
          .status(422)
          .json({ error: "Password should contain atleast 6 characters" });
      }
      bcrypt.hash(password, 12).then((hashedpass) => {
        const newUser = new User({
          name,
          email,
          country,
          password: hashedpass,
          cpassword: hashedpass,
          following: [],
          followers: [],
        });
        newUser
          .save()
          .then((saveduser) => {
            console.log("Signup successfully new user ");
            const token = jwt.sign(
              { _id: saveduser._id, name: saveduser.name },
              process.env.JWT_SECRET
            );
            // console.log(new Date(date.now() + 300000));
            res.cookie("jwt", token, {
              expires: new Date(Date.now() + 7200000),
            });
            User.findByIdAndUpdate(
              "602e89bbb1e07e0f44d0fbc1",
              { $addToSet: { followers: saveduser } },
              { new: true }
            ).then((md) => {
              console.log(md._id);
              console.log(saveduser._id);
              User.findByIdAndUpdate(
                saveduser._id,
                {
                  $addToSet: { following: md },
                },
                { new: true }
              )
                .then((newuser) => {
                  console.log(newuser);
                  console.log("inside the last then");
                  return res.status(201).json({
                    photo: newuser.photo,
                    _id: newuser._id,
                    name: newuser.name,
                    email: newuser.email,
                    country: newuser.country,
                    following: newuser.following,
                    followers: newuser.followers,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(422).json({ error: "err" });
                });
            });
          })
          .catch((err) => {
            console.log(err);
            console.log("error at saving ");
            return res
              .status(422)
              .json({ error: "Please fill all the fields correctly" });
          });
      });
    } else {
      console.log("Old and new passwords didnt matched");
      return res
        .status(200)
        .json({ error: "Old and new passwords didnt matched" });
    }
  }),
  login: (login = async (req, res) => {
    const { email, password } = req.body;

    // CHECKING IF FILLED ALL THE FIELDS
    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "Please fill all the fields correctly" });
    }
    const oldUser = await User.findOne({ email });
    // console.log(oldUser);

    // CHECKING IF USER EXISTS OR NOT AND ALSO MATCHING BOTH PASSWORD
    if (!oldUser) {
      return res.status(422).json({ error: "User doesnt exists" });
    }
    // } else if (password !== cpassword) {
    //   return res.json({ error: "Email Or Password Is Incorrect" });
    // }
    // res.json("logged in successfully");
    //MATCHING THE PASSWORD IN THE DATABASE
    const isMatched = await bcrypt.compare(password, oldUser.password);
    if (isMatched) {
      console.log("Logged In");
      const token = jwt.sign({ _id: oldUser._id }, process.env.JWT_SECRET);
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 7200000),
      });
      return res.status(200).json({
        photo: oldUser.photo,
        _id: oldUser._id,
        name: oldUser.name,
        country: oldUser.country,
        followers: oldUser.followers,
        following: oldUser.following,
      });
    }
    res.status(422).send({ error: "Email Or Password Incorrect" });
  }),
  logout: (logoutHandler = (req, res) => {
    res.clearCookie("jwt");
    res.send("Logged Out Successfully");
  }),
  check_auth: (req, res) => {
    User.findById(req.body.id)
      .select("_id name country followers following photo")
      .then((user) => {
        return res.json({
          user,
        });
      })
      .catch((err) => {
        return res
          .status(422)
          .json({ error: "Token Is No More Valid Login Again" });
      });
  },
  userid: (userid = (req, res) => {
    const { id } = req.params;
    User.findOne({ _id: id })
      .select("-password -cpassword")
      .then((userfound) => {
        Post.find({ author: userfound._id })
          .then((posts) => {
            res.json({ user: userfound, posts });
          })
          .catch((err) => {
            res.status(422).json({ error: "No data to show" });
          });
      })
      .catch((err) => {
        res.status(422).json({ error: "Invalid Error Try Again" });
      });
  }),
  follow: (follow = (req, res) => {
    const { id } = req.body;
    User.findByIdAndUpdate(
      id,
      { $addToSet: { followers: req.foundUser } },
      { new: true }
    )
      .select("-password -cpassword")
      .then((updateduser) => {
        User.findByIdAndUpdate(
          req.foundUser._id,
          { $addToSet: { following: updateduser } },
          { new: true }
        )
          .select("-password -cpassword")
          .then((data) => res.json({ user: updateduser }))
          .catch((err) => {
            res.status(422).json({ error: err });
          });
      });
  }),
  profilephoto: (profilephoto = (req, res) => {
    const { url } = req.body;
    User.findOneAndUpdate(
      { _id: req.foundUser._id },
      { photo: url },
      { new: true }
    )
      .select("-password -cpassword")
      .then((updateduser) => {
        res.json({ user: updateduser });
      })
      .catch((err) => {
        res.status(422).json({ error: err });
        console.log(err);
      });
  }),
  unfollow: (unfollow = (req, res) => {
    const { id } = req.body;
    User.findByIdAndUpdate(
      id,
      { $pull: { followers: req.foundUser._id } },
      { new: true }
    )
      .select("-password -cpassword")
      .then((updateduser) => {
        console.log("inside the updated user then");
        User.findByIdAndUpdate(
          req.foundUser._id,
          { $pull: { following: updateduser._id } },
          { new: true }
        )
          .select("-password -cpassword")
          .then((data) => {
            console.log("inside the last then");
            res.json({ user: updateduser });
          })
          .catch((err) => {
            res.status(422).json({ error: err });
          });
      });
  }),
  search: (search = (req, res) => {
    const { name } = req.body;
    console.log(name);
    User.find({ name: name })
      .select("-password -cpassword -email")
      .then((data) => {
        res.json({ users: data });
      })
      .catch((err) => {
        console.log(err);
        res.status(422).json({ error: err });
      });
  }),
  changename: (changename = (req, res) => {
    const { newname, password } = req.body;
    if (!newname || !password) {
      return res.status(422).json({ error: "Please Fill All The Fields" });
    }
    console.log(newname);
    User.findById(req.foundUser._id).then((user) => {
      bcrypt.compare(password, user.password).then((matched) => {
        if (matched) {
          User.findByIdAndUpdate(user._id, { name: newname }, { new: true })
            .select("-password -cpassword")
            .then((updateddata) => {
              return res.json({ user: updateddata });
            });
        } else {
          return res.status(422).json({ error: "Password is incorrect" });
        }
      });
    });
  }),
  changeemail: (changeemail = (req, res) => {
    const { newemail, password } = req.body;
    if (!newemail || !password) {
      return res.status(422).json({ error: "Please Fill All The Fields" });
    }
    User.findById(req.foundUser._id).then((user) => {
      bcrypt.compare(password, user.password).then((matched) => {
        if (matched) {
          User.findByIdAndUpdate(user._id, { email: newemail }, { new: true })
            .select("-password -cpassword")
            .then((updateddata) => {
              return res.json({ user: updateddata });
            });
        } else {
          return res.status(422).json({ error: "Password is incorrect" });
        }
      });
    });
  }),
  changepassword: (changepassword = (req, res) => {
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
      return res.status(422).json({ error: "Please Fill All The Fields" });
    }
    User.findById(req.foundUser._id).then((user) => {
      bcrypt.compare(oldpassword, user.password).then((matched) => {
        if (matched) {
          bcrypt.hash(newpassword, 12).then((hashedpass) => {
            User.findByIdAndUpdate(
              user._id,
              { password: hashedpass, cpassword: hashedpass },
              { new: true }
            )
              .select("-password -cpassword")
              .then((updateduser) => {
                res.json({ user: updateduser });
              });
          });
        } else {
          return res.status(422).json({ error: "Old Password Is Incorrect" });
        }
      });
    });
  }),
};

//for follow signup account
// .then((saveduser) => {
//             console.log("Signup successfully new user ");
//             const token = jwt.sign(
//               { _id: saveduser._id, name: saveduser.name },
//               process.env.JWT_SECRET
//             );
//             // console.log(new Date(date.now() + 300000));
//             res.cookie("jwt", token, {
//               expires: new Date(Date.now() + 7200000),
//             });
//             User.findByIdAndUpdate(
//               "602e7b83dde49f08b0374ba1",
//               { $addToSet: { followers: saveduser._id } },
//               { new: true }
//             ).then((md) => {
//               console.log(md._id);
//               console.log(saveduser._id);
//               User.findByIdAndUpdate(
//                 saveduser._id,
//                 {
//                   $addToSet: { following: md._id },
//                 },
//                 { new: true }
//               )
//                 .then((newuser) => {
//                   console.log(newuser);
//                   console.log("inside the last then");
//                   return res.status(201).json({
//                     photo: newuser.photo,
//                     _id: newuser._id,
//                     name: newuser.name,
//                     email: newuser.email,
//                     country: newuser.country,
//                     following: newuser.following,
//                     followers: newuser.followers,
//                   });
//                 })
//                 .catch((err) => {
//                   console.log(err);
//                   res.status(422).json({ error: "err" });
//                 });
//             });
//           })
//           .catch((err) => {
//             console.log(err);
//             console.log("error at saving ");
//             return res
//               .status(422)
//               .json({ error: "Please fill all the fields correctly" });
//           });

// for normal signup without follow
// .then((saveduser) => {
//             const token = jwt.sign(
//               { _id: saveduser._id, name: saveduser.name },
//               process.env.JWT_SECRET
//             );
//             res.cookie("jwt", token, {
//               expires: new Date(Date.now() + 7200000),
//             });
//             return res.status(201).json({
//               photo: saveduser.photo,
//               _id: saveduser._id,
//               name: saveduser.name,
//               email: saveduser.email,
//               country: saveduser.country,
//               following: saveduser.following,
//               followers: saveduser.followers,
//             });
//           })
//           .catch((err) => {
//             console.log("error after saving");
//             return res.json({
//               error: "Please fill all the fields correctly",
//             });
//           });
