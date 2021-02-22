import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ChangeName({ setchange }) {
  const [user, setuser] = useState({
    newname: "",
    password: "",
  });
  const namechange = () => {
    axios({
      method: "put",
      url: "/changename",
      data: {
        newname: user.newname,
        password: user.password,
      },
    })
      .then((res) => {
        toast.success(<h2>Name Changed Successfully</h2>);
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
    setchange({ email: false, name: true, password: false });
  }, []);
  return (
    <div className="changewrapper">
      <h1 className="closebtn" onClick={close}>
        X
      </h1>
      <div className="changewrappers">
        <div className="newname">
          <label htmlFor="newname">New Name</label>
          <input
            type="text"
            id="newname"
            maxLength="20"
            value={user.newname}
            onChange={(e) => setuser({ ...user, newname: e.target.value })}
          />
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setuser({ ...user, password: e.target.value })}
          />
        </div>
        <button className="changesubmit" onClick={namechange}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChangeName;
