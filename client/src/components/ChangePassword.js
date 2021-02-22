import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function ChangePassword({ setchange }) {
  const [user, setuser] = useState({
    oldpassword: "",
    newpassword: "",
  });

  const passwordchange = () => {
    console.log(user.oldpassword);
    console.log(user.newpassword);
    axios({
      method: "put",
      url: "/changepassword",
      data: {
        oldpassword: user.oldpassword,
        newpassword: user.newpassword,
      },
    })
      .then((res) => {
        toast.success(<h2>Password Changed Successfully</h2>);
        const user = JSON.stringify(res.data.user);
        localStorage.setItem("user", user);
        setchange({ name: false, email: false, password: false });
      })
      .catch((err) => {
        toast.warn(<h2>{err.response.data.error}</h2>);
      });
  };
  const close = () => {
    setchange({ email: false, name: false, password: false });
  };
  useEffect(() => {
    setchange({ email: false, name: false, password: true });
  }, []);
  return (
    <div className="changewrapper">
      <h1 className="closebtn" onClick={close}>
        X
      </h1>
      <div className="changewrappers">
        <div className="newname">
          <label htmlFor="newname">Old password</label>
          <input
            type="password"
            id="newname"
            value={user.oldpassword}
            onChange={(e) => setuser({ ...user, oldpassword: e.target.value })}
          />
        </div>
        <div className="password">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={user.newpassword}
            onChange={(e) => setuser({ ...user, newpassword: e.target.value })}
          />
        </div>
        <button className="changesubmit" onClick={passwordchange}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
