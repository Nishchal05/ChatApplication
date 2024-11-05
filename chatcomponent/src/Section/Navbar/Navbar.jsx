import React, { useContext, useState } from "react";
import "./Navbar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contextapi";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { getSender } from "../config/chatlogic";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, view, setview, notification } = useContext(UserContext);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
};


  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open2 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl(null);
  };
  console.log("user",user);
  return (
    <div className="Navbar">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {user ? (
              <>
                <img
                  src={user.profile}
                  alt="Profile"
                  className="profilePic"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <span
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexDirection: "column",
                  }}
                >
                  <span>Name: {user.name}</span>
                  <span>Email: {user.email}</span>
                </span>
                <div
                  onClick={handleLogout}
                  style={{
                    cursor: "pointer",
                    border: "1px dotted black",
                    width: "80px",
                    padding: "5px",
                    borderRadius: "12px",
                  }}
                >
                  Logout
                </div>
              </>
            ) : (
              <>Guest</>
            )}
          </Typography>
        </Box>
      </Modal>
      <nav>
        <div>
          <span className="AppName">
            <Link to="/">Livechat</Link>
          </span>
        </div>
        <div>
        <span>
              <button
                id="AppAuth"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <NotificationsIcon style={{ fontSize: "1rem", color: 'black' }} />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open2}
                onClose={handleClose2}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose2}>
                  {notification && notification.length > 0 ? (
                    notification.map((val, index) => (
                      <div key={index} style={{ marginBottom: '5px' }}>
                        New message from {getSender(user, val.chat.users)}
                      </div>
                    ))
                  ) : (
                    "No Notifications"
                  )}
                </MenuItem>
              </Menu>
            </span>
          <span className="AppAuth" onClick={handleOpen}>
            {user ? (
              <img
                src={user.profile}
                alt="Profile"
                className="profilePic"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <AccountCircleIcon />
            )}
            Profile
          </span>
          {!user ? (
            <>
              <span className="AppAuth">
                <Link to="/Login">
                  <LoginIcon />
                  Login
                </Link>
              </span>
              <span className="AppAuth">
                <Link to="/Register">
                  <AppRegistrationIcon />
                  Register
                </Link>
              </span>
            </>
          ) : (
            <span className="AppAuth" onClick={handleLogout}>
              <LogoutIcon />
              Logout
            </span>
          )}
          <span className="AppAuth">
            <SettingsIcon />
            Settings
          </span>
        </div>
        <div
          className="menu"
          onClick={() => {
            setview(!view);
          }}
        >
          {!view ? <CloseIcon /> : <MenuIcon />}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
