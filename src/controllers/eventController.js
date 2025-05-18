// controllers/eventController.js
const eventQueue = require("../services/eventQueue");

exports.createEvent = async (req, res) => {
  try {
    const { type, actorId, targetUserId, entityId, metadata } = req.body;

    if (!type || !actorId || !targetUserId) {
      return res.status(400).json({
        error: "Missing required fields: type, actorId, targetUserId",
      });
    }

    const validTypes = ["follow", "like", "comment", "mention", "job"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid event type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    const eventId = Date.now().toString();
    const event = {
      id: eventId,
      type,
      actorId,
      targetUserId,
      entityId,
      metadata,
    };

    eventQueue.publish(event);

    res.status(201).json({ success: true, eventId });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
