const express = require("express");
const router = express.Router();

const TempLiveUserController = require("./tempLiveUser.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

// router.get("/", TempLiveUserController.destroy);

module.exports = router;
