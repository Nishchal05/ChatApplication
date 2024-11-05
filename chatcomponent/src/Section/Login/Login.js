import React, { useState, useContext } from "react";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockIcon from "@mui/icons-material/Lock";
import "./Login.css";
import { Backendlink } from "../../Backendlink";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contextapi";
import Slidebar from "../Slidebar";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const DetailSubmission = async () => {
    try {
      const response = await fetch(`${Backendlink}/api/user/Login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.message === "Login successfully") {
        setUser(data.user);
        toast.success(data.message, {
          onClose: () => navigate("/"),
          autoClose: 1000,
        });
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast("error in Login");
      console.error(`Error in Login: ${error}`);
    }
  };
  return (
    <div className="Chatbody">
    <Slidebar/>
      <div className="Login">
        <div className="Logincontainer">
          <span className="Loginpage">Welcome...</span>
          <span className="email-password">
            <span>Email:</span>
            <input
              type="email"
              placeholder="Gmail@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <AlternateEmailIcon className="Icons" />
          </span>
          <span className="email-password">
            <span>Password:</span>
            <input
              type="password"
              placeholder="*****"
              onChange={(e) => setPassword(e.target.value)}
            />
            <LockIcon className="Icons" />
          </span>
          <button onClick={DetailSubmission}>Submit</button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
