import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
const selectphoto = () => {
  document.getElementById("profilephoto").click();
};
function Myprofile() {
  const [country, setflag] = useState("");
  const [myprofile, setmyprofile] = useState({
    photo: "",
    name: "",
    country: "",
    followers: [],
    following: [],
  });
  const [myposts, setmyposts] = useState({
    total: 0,
    posts: [],
  });
  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("user"));
    if (userinfo !== null) {
      setmyprofile(userinfo);

      axios
        .get(
          `https://restcountries.eu/rest/v2/name/${userinfo.country}?fullText=true`
        )
        .then((res) => {
          setflag(res.data[0].flag);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    axios({
      method: "get",
      url: "/mypost",
    })
      .then((res) => {
        if (typeof res.data.posts === "object") {
          setmyposts({
            total: res.data.posts.length,
            posts: [...res.data.posts],
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  return (
    <>
      <div className="profilecontainer">
        <Link className="gohomebtn" to="/mainscreen">
          Go Home
        </Link>
        <motion.div
          className="upside"
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
          initial={{ y: "-80vh" }}
          exit={{ y: "-80vh" }}
        >
          <div className="userp" onClick={selectphoto}>
            <input
              type="file"
              accept="image/*"
              id="profilephoto"
              style={{ display: "none" }}
              onChange={(e) => {
                const photo = new FormData();
                photo.append("file", e.target.files[0]);
                photo.append("upload_preset", "profile_nest");
                photo.append("cloud_name", "profilenest");
                fetch(
                  "https://api.cloudinary.com/v1_1/profilenest/image/upload",
                  {
                    method: "post",
                    body: photo,
                  }
                )
                  .then((res) => res.json())
                  .then((photourl) => {
                    axios({
                      method: "patch",
                      url: "/profilephoto",
                      data: { url: photourl.url },
                    }).then((res) => {
                      setmyprofile(res.data.user);
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            />
            <img src={myprofile.photo} alt="" className="Profileimg" />
            <div className="changephoto">
              <h1>Change Profile Photo</h1>
            </div>
          </div>
          <div className="prof">
            <div className="userinfo">
              <h1>Name: {myprofile.name}</h1>
              <div className="usercountry">
                <h1>Country: {myprofile.country}</h1>
                {country ? (
                  <img src={country} alt="" className="countryflag"></img>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="userfollowers">
              <div className="followers">
                <h1>Followers</h1>
                <h3>{myprofile.followers.length}</h3>
              </div>
              <div className="followings">
                <h1>Following</h1>
                <h3>{myprofile.following.length}</h3>
              </div>
              <div className="posts">
                <h1>Posts</h1>
                <h3>{myposts.posts.length}</h3>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="downside">
          <div className="allimages">
            {myposts.posts.length > 0 ? (
              myposts.posts.map((post) => {
                return (
                  <motion.img
                    inital={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={post._id}
                    src={post.photo}
                    alt="Photo here"
                    className="myposts"
                  />
                );
              })
            ) : (
              <h1 className="noposts">No Posts to show</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Myprofile;
