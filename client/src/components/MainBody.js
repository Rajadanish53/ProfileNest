import React, { useEffect, useState, useContext } from "react";
import NewPost from "./Newpost";
import Post from "./Post";
import Animation from "./animations/Animations";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../userAuth";
import axios from "axios";

function MainBody() {
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();
  const [allpost, setallpost] = useState([]);
  useEffect(() => {
    axios({
      method: "get",
      url: "/allpost",
    })
      .then((res) => {
        // author body comments createdAt likes photo title _id
        setallpost(res.data.posts);
      })
      .catch((err) => {
        if (
          err.response.data.error ===
          "Token Is No More Valid Please Login Again"
        ) {
          toast.error(<h2>{err.response.data.error}</h2>);
          dispatch({ type: "LOGOUT" });
          history.push("/");
        } else {
          toast.error(<h2>Some Server Error Occured</h2>);
        }
      });
  }, []);
  return (
    <motion.section
      className="mainsection"
      variants={Animation.Fadein}
      animate="visible"
      initial="hidden"
      exit="exit"
    >
      <NewPost addnewpost={setallpost} oldpost={allpost} />
      {/* https://restcountries.eu/rest/v2/name/${country}?fullText=true */}
      {allpost.length > 0 ? (
        allpost.map((post) => {
          return (
            <Post
              likes={post.likes}
              key={post._id}
              id={post._id}
              postauthor={post.author}
              author={post.authorname}
              body={post.body}
              title={post.title}
              createdAt={post.createdAt}
              photo={post.photo}
            />
          );
        })
      ) : (
        <h1 className="noposts">No Posts Found</h1>
      )}
    </motion.section>
  );
}

export default MainBody;
