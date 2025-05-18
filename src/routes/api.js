// routes/api.js
const express = require("express");
const router = express.Router();
const notificationsRouter = require("./notifications");
const eventsRouter = require("./events");

router.use("/notifications", notificationsRouter);
router.use("/events", eventsRouter);

module.exports = router;
