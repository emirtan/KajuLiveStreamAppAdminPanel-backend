const Notification = require("./notification.model");
const dayjs = require("dayjs");

//for android
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.find({
      user_id: req.query.user_id,
    }).sort({ createdAt: -1 });

    if (!notification) {
      return res.status(200).json({ status: false, message: "not found" });
    }
    let now = dayjs();

    const notification_ = notification.map((data) => ({
      _id: data._id,
      title: data.title,
      description: data.description,
      type: data.type,
      image: data.image,
      user_id: data.user_id,
      time:
        now.diff(data.createdAt, "minute") <= 60 &&
        now.diff(data.createdAt, "minute") >= 1
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? now.diff(data.createdAt, "day") + " days ago"
          : now.diff(data.createdAt, "hour") + " hours ago",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      __v: data.__v,
    }));
    return res
      .status(200)
      .json({ status: true, message: "success", data: notification_ });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
