const ChatModal = require("../Modals/ChatModal");
const UserModal = require("../Modals/UserModal");

// req.user._id is the current logged-in user
// userId is the user to chat with
const accesschat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send("User ID not provided");
  }

  try {
    // Check if the chat already exists
    let isChat = await ChatModal.find({
      isgroupchat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
       .populate("users", "-password")
       .populate("latestmessage");
    isChat = await UserModal.populate(isChat, {
        path: "latestmessage.sender",
        select: "name profile email"
    });
    if (isChat && isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      // Create new chat if it doesn't exist
      const chatData = {
        chatName: "sender",
        isgroupchat: false,
        users: [req.user._id,userId],
      };
      const createdChat = await ChatModal.create(chatData);
      const fullChat = await ChatModal.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).send(fullChat);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const fetchchats = async (req, res) => {
  try {
    const result = await ChatModal.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupadmin", "-password")
      .populate("latestmessage")
      .sort({ updatedAt: -1 });

    const fullResult = await UserModal.populate(result, {
      path: "latestmessage.sender",
      select: "name pic email",
    });

    res.status(200).send(fullResult);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send("At least 2 users are required");
  }

  users.push(req.user);

  try {
    const groupChat = await ChatModal.create({
      chatName: req.body.name,
      users: users,
      isgroupchat: true,
      groupadmin: req.user,
    });

    const fullChat = await ChatModal.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupadmin", "-password");
    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updatechatgroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await ChatModal.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupadmin", "-password");

    if (!updatedChat) {
      res.status(404).send("Chat not found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addtogroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const updatedChat = await ChatModal.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupadmin", "-password");

    if (!updatedChat) {
      res.status(404).send("Chat not found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const removefromgroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const updatedChat = await ChatModal.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupadmin", "-password");

    if (!updatedChat) {
      res.status(404).send("Chat not found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  accesschat,
  fetchchats,
  createChat,
  updatechatgroup,
  addtogroup,
  removefromgroup,
};
