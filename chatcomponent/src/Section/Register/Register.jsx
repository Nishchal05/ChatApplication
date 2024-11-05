import React, { useState,useContext } from "react";
import "./Register.css";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { Backendlink } from "../../Backendlink";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { UserContext } from "../../contextapi";
import "./Register.css";
import Slidebar from "../Slidebar";
const Register = () => {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [number, setnumber] = useState("");
  const [profile, setprofile] = useState("");
  const { setUser } = useContext(UserContext);

  const CreateAccount = async () => {
    try {
      const response = await fetch(`${Backendlink}/api/user/Register`, {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          number,
          profile,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.message === "Account successfully created" && data.user) {
        setUser(data.user);
        toast.success(data.message, {
          onClose: () => navigate("/"),  
          autoClose: 1000,              
        });
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast("An error occurred during registration.");
    }
  };

  const handlefileupload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setprofile(base64);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const filereader = new FileReader();
      filereader.readAsDataURL(file);
      filereader.onload = () => {
        resolve(filereader.result);
      };
      filereader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <div className="Chatbody">
    <Slidebar/>
      <div className="RegisterBody">
      <div className="RegisterContainer">
        <span className="RegisterHeading">
          Register Now to Unlock Exclusive Features...
        </span>
        <span>
          Name:
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setname(e.target.value)}
          />
          <BadgeIcon className="Icons" />
        </span>
        <span>
          Email:
          <input
            type="email"
            placeholder="Gmail@gmail.com"
            onChange={(e) => setemail(e.target.value)}
          />
          <AlternateEmailIcon className="Icons" />
        </span>
        <span>
          Password:
          <input
            type="password"
            placeholder="***"
            onChange={(e) => setpassword(e.target.value)}
          />
          <LockIcon className="Icons" />
        </span>
        <span>
          Mobile no.:
          <input
            type="tel"
            placeholder="91**********"
            onChange={(e) => setnumber(e.target.value)}
          />
          <LockIcon className="Icons" />
        </span>
        <span>
          Profile Pic:
          <input
            type="file"
            label="Image"
            name="myfile"
            id="file-upload"
            accept=".jpeg, .png, .jpg"
            onChange={(e) => handlefileupload(e)}
            style={{
              backgroundBlendMode:'rgb(2, 2, 30)'
            }}
          />
          <AddPhotoAlternateOutlinedIcon className="Icons" />
        </span>
        <button onClick={CreateAccount}>Create</button>
        <ToastContainer />
      </div>
    </div>
    </div>
  );
};

export default Register;
