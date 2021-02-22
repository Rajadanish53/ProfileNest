import React from "react";
import Error404 from "./Error404";

function ProtectedRoute({ children }) {
  return <>{localStorage.getItem("verified") ? children : <Error404 />}</>;
}

export default ProtectedRoute;
