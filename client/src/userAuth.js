import { createContext } from "react";

export const AuthContext = createContext();
export const initState = {
  verified: false,
  user: {
    country: "",
    name: "",
    _id: "",
  },
};
export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("verified", true);
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        verified: true,
        user: { ...action.payload },
      };
    case "LOGOUT":
      localStorage.removeItem("verified");
      localStorage.removeItem("user");
      return {
        verified: false,
        user: initState.user,
      };
    default:
      return state;
  }
};
