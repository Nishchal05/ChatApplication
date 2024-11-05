import React, { useState, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Backendlink } from "../../Backendlink";
import { UserContext } from "../../contextapi";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
const Findfriend = () => {
  const navigate=useNavigate();
  const { user,setSelectedChat } = useContext(UserContext);
  const [friend, setFriend] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const accessChat = async (userId) => {
    setLoading(true);
    if (!userId) {
      console.error("User ID is missing!");
      toast.error("User ID is missing!");
      return;
    }

    try {
      console.log("Accessing chat for userId:", userId);
      const response = await fetch(`${Backendlink}/api/chat`, {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data2 = await response.json();
        setSelectedChat(data2);
        navigate('/')
        console.log("data2", data2);
        
      } else {
        const textResponse = await response.text();
        console.error("Unexpected response:", textResponse);
        toast.error(textResponse);
      }
    } catch (error) {
      console.error("Error accessing chat", error);
      toast.error("Failed to access chat.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    if (!friend) {
      toast.error("Please enter a valid email or number");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${Backendlink}/api/user?search=${friend}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const friendsData = await response.json();
      setData(friendsData);
    } catch (error) {
      console.error("Error fetching friends", error);
      toast.error("Error fetching friends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "90vh",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "black",
          height: "80vh",
          minWidth:'30%',
          padding: "20px",
        }}
      >
        <div style={{display: 'flex'}}>
          <input
            type="text"
            placeholder="Number or email"
            onChange={(e) => setFriend(e.target.value)}
            style={{
              backgroundColor: "transparent",
              color: "#00e676",
              width: "90%",
            }}
          />
          <span
            onClick={fetchFriends}
            style={{ cursor: "pointer", marginLeft: "10px" }}
          >
            <SearchIcon />
          </span>
        </div>
        {loading ? (
          <Loader/>
        ) : (
          data.map((val, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "10px",
                alignItems: "center",
                backgroundColor: "transparent",
                padding: "10px",
                borderRadius: "5px",
                transition: "background-color 0.3s",
                cursor:"pointer"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#494F55")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              onClick={()=>{accessChat(val._id)}}
            >
              <img
                src={val.profile}
                alt="pic"
                style={{
                  height: "30px",
                  borderRadius: "27px",
                  border: "2px solid black",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{val.name}</span>
                <span>{val.number}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Findfriend;
