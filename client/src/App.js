import React, { useEffect, useState, useReducer } from "react";
import "./App.css";
import { Switch, Route, useLocation, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { AuthReducer, initState, AuthContext } from "./userAuth";
import Error404 from "./components/Error404";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Mainscreen from "./components/screens/Mainscreen";
import ProtectedRoute from "./components/ProtectedRoute";
import MyProfile from "./components/screens/Myprofile";
import UserProfile from "./components/screens/UserProfile";
import Search from "./components/screens/Search";

function App() {
  const [searched, setsearched] = useState([]);
  const [state, dispatch] = useReducer(AuthReducer, initState);
  const location = useLocation();
  const history = useHistory();
  // console.log(localStorage.getItem("user"));
  useEffect(() => {
    if (
      localStorage.getItem("user") &&
      localStorage.getItem("verified") &&
      location.pathname === "/"
    ) {
      // console.log(localStorage.getItem("user"));
      const { _id } = JSON.parse(localStorage.getItem("user"));
      axios({
        method: "POST",
        url: "/check_auth",
        data: {
          id: _id,
        },
      })
        .then((res) => {
          dispatch({ type: "LOGIN", payload: res.data.user });
          history.push("/mainscreen");
        })
        .catch((err) => {
          toast.error(<h2>{err.response.data.error}</h2>);
          dispatch({ type: "LOGOUT" });
          history.push("/");
        });
    }
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ state, dispatch }}>
        <AnimatePresence exitBeforeEnter={true}>
          <Switch location={location} key={location.key}>
            <Route exact path="/">
              <Login />
            </Route>

            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route exact path="/myprofile">
              <ProtectedRoute>
                <MyProfile userinfo={state} />
              </ProtectedRoute>
            </Route>
            <Route exact path="/mainscreen">
              <ProtectedRoute>
                <Mainscreen setsearched={setsearched} />
              </ProtectedRoute>
            </Route>
            <Route exact path="/search">
              <ProtectedRoute>
                <Search searched={searched} />
              </ProtectedRoute>
            </Route>
            <Route exact path="/user/:id">
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            </Route>

            <Route path="/*" component={Error404} />
          </Switch>
        </AnimatePresence>

        <ToastContainer autoClose={2500} />
      </AuthContext.Provider>
    </>
  );
}

export default App;
