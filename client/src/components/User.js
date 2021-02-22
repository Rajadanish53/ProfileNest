import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../userAuth";
import { useHistory } from "react-router-dom";

function User({ country, following, followers, name, photo, id }) {
  const [userid, setuserid] = useState("");
  const { state } = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    setuserid(state.user._id);
  }, []);
  return (
    <>
      <div
        className="userwrapper"
        onClick={() =>
          userid == id
            ? history.push("/myprofile")
            : history.push(`/user/${id}`)
        }
      >
        <div className="userbox">
          <img src={photo} alt="no photo" />
          <div className="userinfo">
            <h1>Name: {name}</h1>
            <h1>Country: {country}</h1>
            <h1>Following: {following.length}</h1>
            <h1>Followers: {followers.length}</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
