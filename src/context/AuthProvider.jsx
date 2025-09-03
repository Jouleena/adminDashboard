import { useState } from "react";
import { AuthContext } from "./AuthContext";
import axiosInstance from "../Services/AxiosInstance";
export const AuthProvider = ({children}) => {
  const [isAuthenticated , setIsAuthenticated] = useState(false);
  const [user , setUser ] = useState({phonenumber:"",password:""});
  const [role , setRole] = useState("");
  const login = async (phonenumber, password , fcmToken) => {
    try {
      const response = await axiosInstance.post("/api/v1.0/Account/login" , {
        phonenumber , password , fcmToken
      })
      const {token , role} = response.data;
      const Token =localStorage.setItem("token",token);
      localStorage.setItem("role",role);
      setRole(role);
      setIsAuthenticated(true);
      setUser({phonenumber:phonenumber , password: password , fcmToken: fcmToken});
      return { success : true , data : response.data }
    } catch (error) {
      console.log(error);
      console.log("Response: ", error.response);
      setIsAuthenticated(false);
      return { success : false , message : error.response?.data?.Title  ||  "Login to dashboard failed invalid input"}
    }
    
  };

  return (
    <AuthContext.Provider value={{isAuthenticated,user,login, role }}>
      {children}
    </AuthContext.Provider>
  );
};