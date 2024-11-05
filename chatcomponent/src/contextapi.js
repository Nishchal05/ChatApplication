import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chat, setChat] = useState(); 
  const [view, setview] = useState(true); 
  const [notification,setnotification]=useState([]);

  return (
    <UserContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chat, setChat,view,setview,notification,setnotification}}>
      {children}
    </UserContext.Provider>
  );
};
