import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import error404 from "../error404.svg";

function Error404() {
  const [counter, setCounter] = useState(5);
  const history = useHistory();
  setTimeout(() => {
    history.push("/");
    window.location.reload();
  }, 5000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((counter) => counter - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="centererror">
        <img src={error404} alt="" className="error404" />
        <h1 className="pagenotfound">Page Not Found</h1>
        <h1>You Will Be Redirected In {counter} Seconds</h1>
      </div>
    </>
  );
}

export default Error404;
