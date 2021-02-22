import React, { useState, useContext } from "react";
import logo from "../../logo.png";
import { toast } from "react-toastify";
import Validator from "validator";
import { motion } from "framer-motion";
import Animation from "../animations/Animations";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import CountiresList from "../CountriesList";
import { AuthContext } from "../../userAuth";
function Signup() {
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();
  const [details, setdetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    country: "Afghanistan",
  });

  const datasenter = async () => {
    const { name, email, password, confirmpassword, country } = details;
    if (!name || !email || !password || !confirmpassword || !country) {
      toast.error(<h2>Please Fill All The Fields</h2>);
    } else if (password !== confirmpassword) {
      toast.error(<h2>Password And Confirm Password Don't Match</h2>);
    } else if (password.length < 6 || confirmpassword.length < 6) {
      toast.error(<h2>Password Should Be Minimum Of 6 Characters</h2>);
    } else if (!Validator.isEmail(email)) {
      toast.error(<h2>Please Enter A Valid Email</h2>);
    } else {
      axios(
        {
          url: "/signupuser",
          method: "POST",
          data: {
            name,
            email,
            password,
            cpassword: confirmpassword,
            country,
          },
        },
        {
          withCredentials: true,
        }
      )
        .then((res) => {
          toast.success(<h2>Account Created Successfully</h2>);
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
      <motion.div
        className="form"
        variants={Animation.slidefromRight}
        animate="visible"
        initial="hidden"
        exit="exit"
      >
        <motion.div className="signupfields">
          <h1>Signup</h1>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            maxLength="16"
            value={details.name}
            onChange={(e) => setdetails({ ...details, name: e.target.value })}
            id="name"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={details.email}
            onChange={(e) => setdetails({ ...details, email: e.target.value })}
          />
          <label htmlFor="countries">Country</label>
          <select
            id="country"
            name="country"
            id="countries"
            value={details.country}
            onChange={(e) =>
              setdetails({ ...details, country: e.target.value })
            }
          >
            <CountiresList />
          </select>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) =>
              setdetails({ ...details, password: e.target.value })
            }
            value={details.password}
          />
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            onChange={(e) =>
              setdetails({ ...details, confirmpassword: e.target.value })
            }
            value={details.confirmpassword}
          />
          <button className="loginbtn" onClick={() => datasenter()}>
            Signup
          </button>
          <Link to="/" className="noaccount">
            Already Have An Account ?
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signup;
