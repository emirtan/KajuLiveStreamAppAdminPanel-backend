const Chat = require("./chat.model");
const User = require("../user/user.model");
const ChatTopic = require("../chatTopic/chatTopic.model");

const { admin } = require("../../firebaseConfig");

exports.getOldChat = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    if (!req.body.user_id)
      return res
        .status(200)
        .json({ status: false, message: "user id is required!" });
    if (!req.body.topic)
      return res
        .status(200)
        .json({ status: false, message: "topic is required!" });

    const chat = await Chat.find({
      $or: [
        { sender_id: req.body.user_id },
        {
          receiver_id: req.body.user_id,
        },
      ],
    }).where({ topic: req.body.topic });

    const list = [];

    chat.map((data) => {
      if (req.body.user_id === data.sender_id.toString()) {
        list.push({
          // sender: data.sender_id,
          message: data.message,
          topic: data.topic,
          flag: 1,
        });
      } else {
        list.push({
          // sender: data.sender_id,
          message: data.message,
          topic: data.topic,
          flag: 0,
        });
      }
    });

    return res
      .status(200)
      .json({ status: true, message: "success", data: list });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details." });
    if (!req.body.sender_id)
      return res
        .status(200)
        .json({ status: false, message: "sender user id is required" });
    if (!req.body.receiver_id)
      return res
        .status(200)
        .json({ status: false, message: "receiver user id is required" });
    if (!req.body.message)
      return res
        .status(200)
        .json({ status: false, message: "message is required" });
    if (!req.body.topic)
      return res
        .status(200)
        .json({ status: false, message: "topic is required" });

    const sender = await User.findById(req.body.sender_id);
    if (!sender) {
      return res
        .status(200)
        .json({ status: false, message: "sender user is not found" });
    }
    const receiver = await User.findById(req.body.receiver_id);
    if (!receiver) {
      return res
        .status(200)
        .json({ status: false, message: "receiver user is not found" });
    }

    const chat = await Chat.create({
      sender_id: req.body.sender_id,
      receiver_id: req.body.receiver_id,
      message: req.body.message,
      topic: req.body.topic,
    });

    if (!chat) {
      throw new Error();
    }

    const user = await await Chat.findById(chat._id).populate(
      "sender_id receiver_id"
    );

    const payload = {
      notification: {
        body: req.body.message,
        title: user.sender_id.name,
        image: user.sender_id.image,
      },
      data: {
        hostid: user.sender_id._id.toString(),
        name: user.sender_id.name,
        image: user.sender_id.image,
        notificationType: "chat",
      },
    };

    admin
      .messaging()
      .sendToDevice(user.receiver_id.fcm_token, payload)

      .then(function (response) {
        // console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
      });

    return res
      .status(200)
      .json({ status: true, message: "success", data: chat });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
