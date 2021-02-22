import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

const uploadfile = () => {
  document.getElementById("browse").click();
};

function NewPost({ addnewpost, oldpost }) {
  const uploadPost = async () => {
    // uploading image to cloudinary
    setpostmodal(false);
    const photo = new FormData();
    photo.append("file", post.photo);
    photo.append("upload_preset", "profile_nest");
    photo.append("cloud_name", "profilenest");

    fetch("https://api.cloudinary.com/v1_1/profilenest/image/upload", {
      method: "post",
      body: photo,
    })
      .then((res) => res.json())
      .then((data) => {
        const { title, body } = post;
        axios({
          method: "post",
          url: "/createpost",
          data: {
            title,
            body,
            photo: data.url,
          },
        })
          .then((res) => {
            setpostmodal(false);
            addnewpost([res.data.post, ...oldpost]);
            setpost({
              title: "",
              body: "",
              photo: "",
            });
            toast.success(<h2>Post Created Successfully</h2>);
          })
          .catch((err) => {
            console.log(err.response);
            toast.error(<h2>{err.response.data.error}</h2>);
          });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  // api.cloudinary.com/v1_1/profilenest
  const [postmodal, setpostmodal] = useState(false);
  const [post, setpost] = useState({
    title: "",
    body: "",
    photo: "",
  });
  return (
    <>
      <div className="newpostb">
        <button
          onClick={() => {
            setpostmodal(true);
            setpost({
              title: "",
              body: "",
              photo: "",
            });
          }}
        >
          New Post
        </button>
      </div>
      {postmodal ? (
        <motion.div
          className="containerpost"
          initial={{ y: "-80vh" }}
          animate={{ y: 0 }}
          exit={{ opacity: 0 }}
        >
          <h1 onClick={() => setpostmodal(false)}>X</h1>
          <div className="postTitle">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              maxLength="40"
              autoFocus
              value={post.title}
              onChange={(e) => setpost({ ...post, title: e.target.value })}
            />
          </div>
          <div className="postBody">
            <label htmlFor="body">Body</label>
            <input
              type="text"
              maxLength="100"
              id="body"
              value={post.body}
              onChange={(e) => setpost({ ...post, body: e.target.value })}
            />
          </div>
          <div className="fileuploading">
            <input
              id="browse"
              type="file"
              className="custom-file-input"
              accept="image/*"
              onChange={(e) => setpost({ ...post, photo: e.target.files[0] })}
            />
            <button onClick={uploadfile}>Upload Photo</button>
          </div>
          <button onClick={() => uploadPost()}>Create Post</button>
        </motion.div>
      ) : (
        ""
      )}
    </>
  );
}

export default NewPost;
