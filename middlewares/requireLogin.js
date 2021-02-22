const jverify = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async (req, res, next) => {
  const { jwt } = req.cookies;
  // console.log(req.cookies.jwt);

  if (jwt) {
    try {
      const payload = jverify.verify(jwt, process.env.JWT_SECRET);
      req.foundUser = await User.findById(payload._id);
      if (req.foundUser) {
        console.log("~~~~MD AUTHORIZED USER~~~~");
        next();
      } else {
        return res
          .status(422)
          .json({ error: "Token Is No More Valid Please Login Again" });
      }
    } catch (err) {
      res
        .status(422)
        .json({ error: "Token Is No More Valid Please Login Again" });
    }
  } else {
    res
      .status(404)
      .json({ error: "Token Is No More Valid Please Login Again" });
  }
};
