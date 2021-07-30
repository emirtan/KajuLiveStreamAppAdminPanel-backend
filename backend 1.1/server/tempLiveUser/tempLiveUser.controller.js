const TempLiveUser = require("./tempLiveUser.model");
const Image = require("../image/image.model");
const dayjs = require("dayjs");

exports.destroy = async (req, res, next) => {
  try {
    const tempLiveUser = await TempLiveUser.findOne({
      user_id: req.query.host_id,
    });

    if (!tempLiveUser) {
      return res.status(200).json({ status: false, message: "success" });
    }

    await tempLiveUser.deleteOne();

    return res.status(200).json({ status: true, message: "success" });
  } catch (error) {
    console.log(error);
  }
};

exports.destroyAll = async (req, res, next) => {
  try {
    const tempUser = await TempLiveUser.find();
    const image = await Image.find();
    if (!tempUser) {
      return res.status(200).json({ status: true, message: "success" });
    }

    let now = dayjs();

    if (tempUser) {
      await tempUser.map(async (user) => {
        await image.map(async (image) => {
          if (user.user_id.toString() === image.user_id.toString()) {
            if (now.diff(image.createdAt, "second") >= 5) {
              console.log("time " + now.diff(image.createdAt, "second"));
              await image.deleteOne();
              await user.deleteOne();
            }
          }
        });
        console.log("Only temp live delete");
        await user.deleteOne();
      });
    }

    await image.map(async (image) => {
      await TempLiveUser.create({
        user_id: image.user_id,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
