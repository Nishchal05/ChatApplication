import React, { useState, useContext, useEffect } from "react";
import "./Body.css";
import { Backendlink } from "../../Backendlink";
import { UserContext } from "../../contextapi";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { toast, ToastContainer } from "react-toastify";
import Slidebar from "../Slidebar";
import Loader from "../Loader";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { getSender } from "../config/chatlogic";
import Chatbox from "./Chatbox";
const Body = () => {
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, setSelectedChat,selectedChat, chat, setChat } = useContext(UserContext);
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
  // Fetch existing chats
  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${Backendlink}/api/chat`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const chatData = await response.json();
      console.log("Fetched chats:", chatData);
      setChat(chatData);
    } catch (error) {
      console.error("Failed to fetch chats", error);
      toast.error("Failed to load chats. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="Chatbody">
      <Slidebar />
      <div className={!selectedChat?"ChaterDetails":"chatdetailHide"}>
        <div className="chatnav">
          <div
            style={{
              backgroundColor: "#1A1A1A",
              padding: "5px",
              borderRadius: "12px",
              display: "flex",
            }}
          >
            <input
              type="text"
              placeholder="Find friends"
              style={{
                backgroundColor: "transparent",
                width: "90%",
                color: "white",
              }}
            />
            <SearchOutlinedIcon className="Icons" />
          </div>
          {loading ? (
            <Loader />
          ) : chat && chat.length > 0 ? (
            <div
              style={{
                color: 'white',
                marginTop: '10px',

              }}
            >
            
              {chat.filter((u) => u.users).map((chats, index) => {
                const sender = getSender(user, chats.users);
                return (
                  <div
                    key={index}
                    style={{
                      border:'1px solid #00e676',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '8px',
                      color: 'white',
                      cursor:"pointer",
                      
                    }}
                  onClick={()=>{
                    console.log("sendername",sender.name)
                    accessChat(sender.id)
                  }} className="chatmember">
                    <img
                      src={sender.profile} 
                      alt={sender.name}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }}
                    />
                    <div>
                      <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {!chats.isGroupChat ? sender.name : chats.chatName}
                      </p>
                      {chats.latestMessage && (
                        <p style={{ fontSize: '14px', marginTop: '5px' }}>
                          <b>{chats.latestMessage.sender.name}: </b>
                          {chats.latestMessage.content.length > 50
                            ? chats.latestMessage.content.substring(0, 51) + "..."
                            : chats.latestMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'white', marginTop: '20px' }}>No chats available</p>
          )}
        </div>
        <ToastContainer />
      </div>
      <Link
        style={{
          height: "50px",
          width: "50px",
          backgroundColor: "#00e676",
          borderRadius: "50%",
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        to="/Addfriend"
      >
        <AddIcon />
      </Link>
      <Chatbox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  );
};

export default Body;
