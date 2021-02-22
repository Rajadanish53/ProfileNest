import React, { useState, useContext } from "react";
import Animation from "../animations/Animations";
import Validator from "validator";
import { toast } from "react-toastify";
import logo from "../../logo.png";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../userAuth";

function Login() {
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();
  const [details, setdetails] = useState({
    email: "",
    password: "",
  });

  const checkdata = async () => {
    const { email, password } = details;
    if (!email || !password) {
      toast.error(<h2>Please Fill All The Fields</h2>);
    } else if (!Validator.isEmail(email)) {
      toast.error(<h2>Email Is Not Valid</h2>);
    } else {
      // console.log(email, password);
      axios(
        {
          url: "/loginuser",
          method: "POST",
          data: {
            email,
            password,
          },
        },
        {
          withCredentials: true,
        }
      )
        .then((res) => {
          toast.success(<h2>Logged In Successfully</h2>);
          dispatch({
            type: "LOGIN",
            payload: res.data,
          });
          history.push("/mainscreen");
        })
        .catch((err) => {
          toast.error(<h2>{err.response.data.error}</h2>);
        });
    }
  };
  return (
    <div className="homecontainer">
      <motion.img
        animate="visible"
        variants={Animation.logoreveal}
        initial="hidden"
        exit="exit"
        src={logo}
        alt=""
      />
      <div className="wrapper">
        <motion.div
          className="text"
          variants={Animation.slidefromRight}
          animate="visible"
          initial="hidden"
          exit="exit"
        >
          <div className="logotag">
            <i className="fas fa-snowflake"></i> <h1>ProfileNest</h1>
            <i className="fas fa-snowflake"></i>
          </div>

          <p>A Simple Social Media Platform To Stay Connected With Everyone</p>
        </motion.div>
        {/* form opening  */}
        <motion.div
          className="form"
          variants={Animation.slidefromRight}
          animate="visible"
          initial="hidden"
          exit="exit"
        >
          <div className="formfields">
            <h1>Login</h1>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={details.email}
              onChange={(e) =>
                setdetails({ ...details, email: e.target.value })
              }
            />
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              value={details.password}
              onChange={(e) =>
                setdetails({ ...details, password: e.target.value })
              }
            />
            <button
              className="loginbtn"
              onClick={() => {
                checkdata();
              }}
            >
              Login
            </button>
            <Link to="/signup" className="noaccount">
              Don't Have A Account ?
            </Link>
          </div>
        </motion.div>
        {/* form closing tag */}
      </div>
    </div>
  );
}

export default Login;
