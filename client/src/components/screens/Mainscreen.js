import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Animation from "../animations/Animations";
import Settingscomp from "../Settings";
import ChangeName from "../ChangeName";
import ChangeEmail from "../ChangeEmail";
import ChangePassword from "../ChangePassword";
import { AuthContext } from "../../userAuth";
import axios from "axios";
import MainBody from "../MainBody";
function Mainscreen({ setsearched }) {
  const [change, setchange] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [Settings, setSettings] = useState(false);
  const [Search, setSearch] = useState("");
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();
  const Settingtoggle = () => {
    if (Settings) {
      setSettings(false);
    } else {
      setSettings(true);
    }
  };
  const Searchuser = () => {
    if (Search) {
      const final = Search.trim();
      axios
        .post("/search", { name: final })
        .then((res) => {
          if (!res.data.users.length == 0) {
            setsearched(res.data.users);
            history.push("/search");
          } else {
            toast.warn(<h2>No User Found</h2>);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const logout = () => {
    axios({
      method: "get",
      url: "/logout",
    }).then((res) => {
      localStorage.removeItem("verified");
      localStorage.removeItem("user");
      toast.success(<h2>{res.data}</h2>);
      history.push("/");
    });
  };
  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("verified")) {
      dispatch({
        type: "LOGIN",
        payload: JSON.parse(localStorage.getItem("user")),
      });
    }
  }, []);
  return (
    <>
      <motion.nav
        variants={Animation.slideDown}
        animate="visible"
        initial="hidden"
        exit="exit"
      >
        <div className="searchbar">
          <i className="fas fa-search" onClick={Searchuser}></i>
          <input
            type="text"
            value={Search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="links">
          <div className="myprofile">
            <Link to="/myprofile">
              <i className="fas fa-user-circle"></i>
            </Link>
            <Link to="/myprofile" className="link">
              My Profile
            </Link>
          </div>

          <div className="settings">
            <i className="fas fa-cog" onClick={() => Settingtoggle()}></i>
            <h1 className="settinglink" onClick={() => Settingtoggle()}>
              Settings
            </h1>
          </div>
          <button className="logoutbtn" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </motion.nav>
      {Settings ? <Settingscomp setchange={setchange} change={change} /> : ""}
      {change.name ? <ChangeName setchange={setchange} /> : ""}
      {change.email ? <ChangeEmail setchange={setchange} /> : ""}
      {change.password ? <ChangePassword setchange={setchange} /> : ""}
      <MainBody />
    </>
  );
}

export default Mainscreen;
