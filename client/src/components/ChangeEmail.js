import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function ChangeEmail({ setchange }) {
  const [user, setuser] = useState({
    newemail: "",
    password: "",
  });
  const emailchange = () => {
    axios({
      method: "put",
      url: "/changeemail",
      data: {
        newemail: user.newemail,
        password: user.password,
      },
    })
      .then((res) => {
        toast.success(<h2>Email Changed Successfully</h2>);
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
    setchange({ email: true, name: false, password: false });
  }, []);

  return (
    <div className="changewrapper">
      <h1 className="closebtn" onClick={close}>
        X
      </h1>
      <div className="changewrappers">
        <div className="newname">
          <label htmlFor="newname">New Email</label>
          <input
            type="text"
            id="newname"
            value={user.newemail}
            onChange={(e) => {
              setuser({ ...user, newemail: e.target.value });
            }}
          />
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => {
              setuser({ ...user, password: e.target.value });
            }}
          />
        </div>
        <button className="changesubmit" onClick={emailchange}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChangeEmail;
