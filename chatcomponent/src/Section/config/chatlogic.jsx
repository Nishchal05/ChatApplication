export const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) {
      return { name: "Unknown", profilePic: "" };
  }
  return users[0]._id === loggedUser.id
      ? { name: users[1].name, profile: users[1].profile || "/default-profile.png", id: users[1]._id }
      : { name: users[0].name, profile: users[0].profile || "/default-profile.png", id: users[0]._id };
};

export const isSameSender=(messages,m,i,userId)=>{
  return (i<messages.length-1&&(messages[i+1].sender._id!==m.sender._id || messages[i+1].sender.id===undefined)&&messages[i].sender._id!==userId);
};
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (i < messages.length - 1 && messages[i + 1].sender._id === m.sender._id && messages[i].sender._id !== userId) {
    return 33; 
  } else if ((i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id) || (i === messages.length - 1 && messages[i].sender._id !== userId)) {
    return 0; 
  } else {
    return "auto"; 
  }
};

export const isSameUser=(messages,m,i)=>{
  return i>0 && messages[i-1].sender._id===m.sender._id;
}