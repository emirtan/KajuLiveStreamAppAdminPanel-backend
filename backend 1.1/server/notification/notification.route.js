const express = require("express");
const router = express.Router();

const NotificationController = require("./notification.controller");

var checkAccessWithSecretKey = require("../../checkAccess");

router.get(checkAccessWithSecretKey());
router.get("/getnotification", NotificationController.getNotification);

module.exports = router;
