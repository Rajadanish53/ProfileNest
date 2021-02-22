import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import axios from "axios";
import styles from "./stylesheets/Post.module.css";
import Commentadd from "./Commentadd";
import Comment from "./Comment";
import { Link } from "react-router-dom";
import { AuthContext } from "../userAuth";

function Post({
  title,
  body,
  author,
  createdAt,
  photo,
  id,
  postauthor,
  likes,
}) {
  const [postlike, setpostlike] = useState([...likes]);
  const likecheck = () => {
    axios({
      method: "PUT",
      url: "/likepost",
      data: { id },
    })
      .then((res) => {
        setpostlike(res.data.newpost.likes);
        // console.log(postlike);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const [userid, setuserid] = useState("");
  const { state } = useContext(AuthContext);
  useEffect(() => {
    setuserid(state.user._id);
  }, []);
  const commentcheck = () => {
    if (commentshow) {
      setcommentshow(false);
    } else {
      setcommentshow(true);
    }
  };
  const [commentshow, setcommentshow] = useState(false);
  useEffect(() => {
    axios({
      method: "post",
      data: { id },
      url: "/getcomment",
    })
      .then((res) => {
        if (res.data.comments.length > 0) {
          setcomment([
            { comments: [...res.data.comments] },
            res.data.comments.length,
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [comment, setcomment] = useState([{ comments: [] }, 0]);
  return (
    <>
      <div className={styles.main}>
        <div className="postbyandtim">
          <Link
            to={postauthor == userid ? `/myprofile` : `/user/${postauthor}`}
            className="authorid"
          >
            <h1 className={styles.author}>Post By: {author}</h1>
          </Link>
          <h1 className={styles.createdAt}>
            Created At: {dayjs(createdAt).format("D MMMM YYYY")}
          </h1>
        </div>
        {photo ? (
          <img src={photo} alt="Photo here" className={styles.photo} />
        ) : (
          ""
        )}
        <h1 className={styles.title}>{title}</h1>
        <h1 className={styles.body}>{body}</h1>
        <div className="Likeheart" onClick={() => likecheck()}>
          {postlike.includes(userid) ? (
            <div className="likebutton">
              <div className="liked">
                <i className="fas fa-heart"></i>
                <h1>Liked</h1>
              </div>
              <h2 className="likecount">{postlike.length}</h2>
            </div>
          ) : (
            <div className="likebutton">
              <div className="notliked">
                <i className="fas fa-heart"></i>
                <h1>Like</h1>
              </div>
              <h2 className="likecount">{postlike.length}</h2>
            </div>
          )}
        </div>
        <Commentadd
          id={id}
          newcomment={setcomment}
          oldcomments={comment[0].comments}
        />
        {comment[0].comments.length > 0 ? (
          <button
            className="commenttoggle"
            onClick={() => {
              commentcheck();
            }}
          >
            {commentshow
              ? "Hide Comments"
              : `Show Comments (${comment[0].comments.length})`}
          </button>
        ) : (
          ""
        )}
        {comment[0].comments.length > 0 ? (
          comment[0].comments.map((item) => {
            if (commentshow) {
              return (
                <Comment
                  newcomment={setcomment}
                  oldcomments={comment[0].comments}
                  key={item._id}
                  commentid={item._id}
                  author={item.author}
                  comment={item.comment}
                  time={item.createdAt}
                  commentauthor={item.authorid}
                  authorphoto={item.authorphoto}
                />
              );
            }
          })
        ) : (
          <h1 className="nocomment">No Comments</h1>
        )}
      </div>
    </>
  );
}

export default Post;
