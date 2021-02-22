import React, { useEffect } from "react";
import { useHistory,Link } from "react-router-dom";
import { motion } from "framer-motion";
import User from "../User";
function Search({ searched }) {
  const history = useHistory();
  useEffect(() => {
    if (searched == 0) {
      history.push("/mainscreen");
    }
  }, []);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Link to="/mainscreen" className="gohomebtn">
          Go Home
        </Link>
        {searched.map((user) => {
          return (
            <User
              key={user._id}
              name={user.name}
              id={user._id}
              country={user.country}
              following={user.following}
              followers={user.followers}
              photo={user.photo}
            />
          );
        })}
      </motion.div>
    </>
  );
}

export default Search;
