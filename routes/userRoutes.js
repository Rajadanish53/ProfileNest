const express = require("express");
const RequireLogin = require("../middlewares/requireLogin");
const {
  signup,
  login,
  logout,
  check_auth,
  userid,
  follow,
  profilephoto,
  unfollow,
  search,
  changename,
  changeemail,
  changepassword,
} = require("../controllers/userHandler");
const router = express.Router();
// NEW USER SIGNUP AND MAKING A TOKEN
router.post("/signupuser", signup);
router.post("/loginuser", login);
router.get("/logout", logout);
router.post("/check_auth", RequireLogin, check_auth);
router.get("/user/:id", RequireLogin, userid);
router.put("/follow", RequireLogin, follow);
router.put("/unfollow", RequireLogin, unfollow);
router.patch("/profilephoto", RequireLogin, profilephoto);
router.post("/search", RequireLogin, search);
router.put("/changename", RequireLogin, changename);
router.put("/changeemail", RequireLogin, changeemail);
router.put("/changepassword", RequireLogin, changepassword);
module.exports = router;
