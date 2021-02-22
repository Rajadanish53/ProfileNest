import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Commentadd({ id, newcomment, oldcomments }) {
  const addnewComment = () => {
    if (id && comment) {
      axios({
        method: "post",
        url: "/newcomment",
        data: {
          comment,
          postid: id,
        },
      })
        .then((res) => {
          console.log(res)
          newcomment(
            [{ comments: [res.data.comment, ...oldcomments] }],
            oldcomments.length + 1
          );
          toast.success(<h2>Comment Added Successfully</h2>);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      toast.warn(<h2>Write Something Before Comment</h2>);
    }
  };
  const [comment, setcomment] = useState("");
  return (
    <div className="commentwrapper">
      <input
        type="text"
        maxLength="25"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setcomment(e.target.value)}
      />
      <button className="commentsent" onClick={addnewComment}>
        +
      </button>
    </div>
  );
}

export default Commentadd;
