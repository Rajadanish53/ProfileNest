import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
function UserProfile() {
  const [follow, setfollow] = useState(false);
  const { id } = useParams();

  const unfollowdealer = () => {
    axios({
      method: "put",
      url: "/unfollow",
      data: { id },
    })
      .then((res) => {
        const userfollowing = JSON.parse(localStorage.getItem("user"));
        setuserinfo({ ...userinfo, user: res.data.user });
        if (userfollowing.following.includes(res.data.user._id)) {
          const newuserfollowing = userfollowing.following.filter((id) => {
            return id !== res.data.user._id;
          });
          const updateduser = {
            photo: userfollowing.photo,
            _id: userfollowing._id,
            country: userfollowing.country,
            name: userfollowing.name,
            followers: userfollowing.followers,
            following: newuserfollowing,
          };
          const userwithfollow = JSON.stringify(updateduser);
          localStorage.setItem("user", userwithfollow);
          setfollow(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const followdealer = () => {
    axios({
      method: "put",
      url: "/follow",
      data: { id },
    })
      .then((res) => {
        const userfollowing = JSON.parse(localStorage.getItem("user"));
        setuserinfo({ ...userinfo, user: res.data.user });
        if (!userfollowing.following.includes(res.data.user._id)) {
          userfollowing.following.push(res.data.user._id);
          const userwithfollow = JSON.stringify(userfollowing);
          localStorage.setItem("user", userwithfollow);
          setfollow(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [country, setflag] = useState("");
  const [userinfo, setuserinfo] = useState({
    posts: [],
    user: {
      _id: "",
      photo: "",
      country: "",
      email: "",
      name: "",
      following: [],
      followers: [],
    },
  });

  useEffect(() => {
    axios({
      method: "get",
      url: `/user/${id}`,
    })
      .then((res) => {
        setuserinfo(res.data);
        const userfollowing = JSON.parse(localStorage.getItem("user"));
        if (userfollowing.following.includes(res.data.user._id)) {
          setfollow(true);
        }
        axios
          .get(
            `https://restcountries.eu/rest/v2/name/${res.data.user.country}?fullText=true`
          )
          .then((res) => {
            setflag(res.data[0].flag);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        toast.error(<h2>{err.response.data.error}</h2>);
      });
  }, [id]);
  return (
    <>
      <div className="profilecontainer">
        <Link className="gohomebtn" to="/mainscreen">
          Go Back
        </Link>
        <motion.div
          className="upside"
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 50 }}
          initial={{ y: "-80vh" }}
          exit={{ y: "-80vh" }}
        >
          <img src={userinfo.user.photo} alt="" className="UserProfileimg" />

          <div className="prof">
            <div className="userinfo">
              <h1>Name: {userinfo.user.name}</h1>
              <div className="usercountry">
                <h1>Country: {userinfo.user.country}</h1>
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
                <h3>{userinfo.user.followers.length}</h3>
              </div>
              <div className="followings">
                <h1>Following</h1>
                <h3>{userinfo.user.following.length}</h3>
              </div>
              <div className="posts">
                <h1>Posts</h1>
                <h3>{userinfo.posts.length}</h3>
              </div>
            </div>

            {!follow ? (
              <button onClick={() => followdealer()} className="followbtn">
                Follow
              </button>
            ) : (
              <button onClick={() => unfollowdealer()} className="unfollowbtn">
                Unfollow
              </button>
            )}
          </div>
        </motion.div>
        <div className="downside">
          <div className="allimages">
            {userinfo.posts.length > 0 ? (
              userinfo.posts.map((post) => {
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

export default UserProfile;
