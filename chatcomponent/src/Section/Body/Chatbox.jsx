import React, { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../../contextapi";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from "@mui/icons-material/Call";
import { Backendlink } from "../../Backendlink";
import { toast } from "react-toastify";
import ScrollableFeed from "react-scrollable-feed";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import io from "socket.io-client";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  getSender,
} from "../config/chatlogic";
import PaymentPage from "../Pyments/Payment";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const Chatbox = () => {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [NewMessage, setNewMessage] = useState("");
  const { user, selectedChat, setSelectedChat,notification, setnotification } =
    useContext(UserContext);
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, settyping] = useState(false);
  const [istyping, setistyping] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'transparent',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  const messagehandler = async () => {
    setLoading(true);
    if (!NewMessage || !selectedChat?._id) {
      toast.error("Message content or chat ID is missing");
      setLoading(false);
      return;
    }
    socket.emit("stop typing", selectedChat._id);
    try {
      const response = await fetch(`${Backendlink}/api/message`, {
        method: "POST",
        body: JSON.stringify({
          content: NewMessage,
          chatId: selectedChat._id,
        }),
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      socket.emit("new message", data);
      setMessage([...message, data]);
      setNewMessage("");
    } catch (error) {
      toast.error("Error in sending message");
    } finally {
      setLoading(false);
    }
  };
  const typinghandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000; // 3 seconds
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        settyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing", () => {
      setistyping(true);
    });
    socket.on("stop typing", () => {
      setistyping(false);
    });
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        const isAlreadyNotified = notification.some(
          (notify) => notify._id === newMessageReceived._id
        );
        if (!isAlreadyNotified) {
          setnotification((prev) => [newMessageReceived, ...prev]);
        }
      } else {
        setMessage((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("message received");
    };
  }, [selectedChat, notification, setnotification]);

  const fetchmessage = useCallback(async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${Backendlink}/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      setMessage(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Error in fetching message");
    } finally {
      setLoading(false);
    }
  }, [selectedChat]);

  useEffect(() => {
    fetchmessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchmessage]);

  const { name, profile } = getSender(user, selectedChat?.users || []);

  return (
    <div
      style={{
        width: "100%",
        padding: "13px 40px",
        height: "90vh",
        backgroundColor: "black",
        marginLeft: "12px",
        marginRight: "12px",
        borderRadius: "12px"
      }}
       className={`chatbox ${selectedChat ? "chatboxdisplay" : "chatboxhide"}`}
    >
      {selectedChat ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "80vh",
          }}
        >
          <div
            style={{
              color: "white",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ display: "flex",gap:'10px'}}>
            <ArrowBackIcon className="Icons" style={{cursor:'pointer'}} onClick={()=>{setSelectedChat(null)}}/>
              <img
                src={profile}
                alt="profile"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              {name}
            </span>
            <span style={{ display: "flex", gap: "15px" }}>
              <span className="Icons" 
              style={{cursor:'pointer'}}
              onClick={handleOpen}>
                <CurrencyRupeeIcon />
              </span>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <PaymentPage/>
                </Box>
              </Modal>
              <span style={{cursor:'pointer'}}>
                <CallIcon className="Icons" />
              </span>
            </span>
          </div>

          <ScrollableFeed>
            <div style={{ backgroundColor: "black", height: "86%",marginTop:'30px' }}>
              {loading ? (
                <span className="loader"></span>
              ) : (
                <div style={{ color: "white" }}>
                  {message?.length > 0 &&
                    message.map((msg, i) => (
                      <div
                        key={msg._id}
                        style={{
                          display: "flex",
                          marginBottom: "10px",
                          alignItems: "center",
                        }}
                      >
                        {(isSameSender(message, msg, i, user.id) ||
                          isLastMessage(message, i, user.id)) && (
                          <img
                            src={profile}
                            alt="profile"
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        <span
                          style={{
                            backgroundColor: `${
                              msg.sender._id === user.id ? "blue" : "green"
                            }`,
                            color: "white",
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(
                              message,
                              msg,
                              i,
                              user.id
                            ),
                            marginRight: isSameUser(message, msg, i) ? 3 : 10,
                            alignSelf: `${
                              msg.sender._id === user.id
                                ? "flex-end"
                                : "flex-start"
                            }`,
                          }}
                        >
                          {msg.content}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </ScrollableFeed>

          <div style={{ display: "flex", gap: "10px" }}>
            {istyping && <div style={{ color: "white" }}>Typing...</div>}
            <input
              type="text"
              placeholder="Message"
              style={{
                width: "95%",
                backgroundColor: "transparent",
                color: "orange",
              }}
              onChange={(e) => {
                typinghandler(e);
              }}
              value={NewMessage}
            />
            <button onClick={messagehandler}>
              <SendIcon style={{ transform: "rotate(-45deg)" }} />
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            color: "white",
            width: "100%",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "2rem" }}>Livechat for Windows</p>
          <p>Send and Receive messages without your phone online</p>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
