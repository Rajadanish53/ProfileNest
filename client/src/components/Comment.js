import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";

function Comment({
  author,
  comment,
  time,
  commentauthor,
  commentid,
  oldcomments,
  newcomment,
  authorphoto,
}) {
  const [commentverify, setcommentverify] = useState("");
  const deleteComment = (commentid) => {
    axios({
      method: "delete",
      url: "/deletecomment",
      data: { commentid },
    })
      .then((res) => {
        const filtered = oldcomments.filter((eachcomment) => {
          return eachcomment._id !== res.data.removed._id;
        });
        newcomment([{ comments: [...filtered] }], oldcomments.length + 1);
        toast.success(<h2>Comment Removed Successfully</h2>);
      })
      .catch((err) => {
        toast.error(<h2>Unknown Error Occured</h2>);
      });
  };
  // console.log(authorid == commentauthor);
  useEffect(() => {
    const { _id } = JSON.parse(localStorage.getItem("user"));

    if (_id == null) {
      setcommentverify("");
    } else {
      setcommentverify(_id);
    }
    // if (!JSON.parse(localStorage.getItem("user") == null){
    //   const { _id } = JSON.parse(localStorage.getItem("user"));
    //   setcommentverify(_id)
    // } else {

    // }
  }, []);
  return (
    <div className="commentbox">
      <div className="comment">
        <div className="authortime">
          <div className="oneside">
            <img src={authorphoto} alt="photo here" className="authorphoto" />
            <h1>{author}</h1>
          </div>
          <div className="timedelete">
            <h3 className="commenttime">
              {dayjs(time).format("D MMMM YYYY h:mm:ss a")}
            </h3>
            {commentverify === commentauthor ? (
              <i
                className="fas fa-trash-alt"
                onClick={() => deleteComment(commentid)}
              ></i>
            ) : (
              ""
            )}
          </div>
        </div>
        <h2>{comment}</h2>
      </div>
    </div>
  );
}

export default Comment;
