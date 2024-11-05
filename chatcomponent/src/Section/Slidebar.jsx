import React, { useContext } from "react";
import { UserContext } from "../contextapi";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import StarRateOutlinedIcon from "@mui/icons-material/StarRateOutlined";
import DataThresholdingOutlinedIcon from "@mui/icons-material/DataThresholdingOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { getSender } from "./config/chatlogic";

const Slidebar = () => {
  const navigate = useNavigate();
  const { user, setUser, view, notification } = useContext(UserContext);

  const logouthandle = () => {
    setUser(null);
    navigate("/");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
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

  const [open, setOpen] = React.useState(false);
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

  return (
    <div className="SlideBar">
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
                {user.name}
                {user.email}
                <div onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Logout
                </div>
              </>
            ) : (
              <>Guest</>
            )}
          </Typography>
        </Box>
      </Modal>
      <div>
        <div>
          <>
            <span>
              <button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                style={{ position: "relative" }} // Position relative for badge
              >
                <NotificationsIcon style={{ fontSize: "1rem", color: 'black' }} />
                {notification && notification.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 5px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {notification.length}
                  </span>
                )}
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
          </>
        </div>
        <div>
          <MoreHorizIcon className="Icons" />
          {!view && (
            <>
              <span>Status</span>
            </>
          )}
        </div>
        <div>
          <CurrencyRupeeIcon className="Icons" />
          {!view && (
            <>
              <span>Payment</span>
            </>
          )}
        </div>
      </div>
      {!user ? (
        <>
          <span>
            <div>
              <Link to="/Login">
                <div>
                  <LoginIcon className="Icons" />
                  {!view && <>Login</>}
                </div>
              </Link>
              <div>
                <Link to="/Register">
                  <AppRegistrationIcon className="Icons" />
                  {!view && <>Register</>}
                </Link>
              </div>
            </div>
          </span>
        </>
      ) : (
        <div onClick={logouthandle}>
          <LogoutIcon className="Icons" />
          {!view && <>Logout</>}
        </div>
      )}
      <span>
        <div>
          <div>
            <StarRateOutlinedIcon className="Icons" />
            {!view && (
              <>
                <span>starred message</span>
              </>
            )}
          </div>
          <div>
            <DataThresholdingOutlinedIcon className="Icons" />
            {!view && (
              <>
                <span>Archived chats</span>
              </>
            )}
          </div>
        </div>
        <div>
          <div>
            <SettingsOutlinedIcon className="Icons" />
            {!view && (
              <>
                <span>Settings</span>
              </>
            )}
          </div>
          <div className="profile" onClick={handleOpen}>
            {user ? (
              <img
                src={user.profile}
                alt="Profile"
                className="profilePic"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <AccountCircleOutlinedIcon className="Icons" />
            )}
            {!view && (
              <>
                <span>Profile</span>
              </>
            )}
          </div>
        </div>
      </span>
    </div>
  );
};

export default Slidebar;
