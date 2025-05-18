// services/notificationService.js
const Notification = require("../models/notification");
const User = require("../models/user");
const eventQueue = require("./eventQueue");

class NotificationService {
  constructor() {
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Handle follow events
    eventQueue.on("follow", async (event) => {
      try {
        const actor = await User.findById(event.actorId);
        // Use a fallback name if actor doesn't exist
        const actorName = actor ? actor.name : `User ${event.actorId}`;

        await Notification.create({
          userId: event.targetUserId,
          type: "follow",
          actorId: event.actorId,
          content: `${actorName} started following you`,
        });
      } catch (error) {
        console.error("Error processing follow event:", error);
      }
    });

    // Handle like events
    eventQueue.on("like", async (event) => {
      try {
        const actor = await User.findById(event.actorId);
        // Use a fallback name if actor doesn't exist
        const actorName = actor ? actor.name : `User ${event.actorId}`;

        await Notification.create({
          userId: event.targetUserId,
          type: "like",
          actorId: event.actorId,
          entityId: event.entityId,
          content: `${actorName} liked your post`,
        });
      } catch (error) {
        console.error("Error processing like event:", error);
      }
    });

    // Handle comment events
    eventQueue.on("comment", async (event) => {
      try {
        const actor = await User.findById(event.actorId);
        // Use a fallback name if actor doesn't exist
        const actorName = actor ? actor.name : `User ${event.actorId}`;

        // Safely access comment from metadata with fallback
        const comment =
          event.metadata && event.metadata.comment
            ? event.metadata.comment
            : "...";
        const truncatedComment =
          comment.substring(0, 50) + (comment.length > 50 ? "..." : "");

        await Notification.create({
          userId: event.targetUserId,
          type: "comment",
          actorId: event.actorId,
          entityId: event.entityId,
          content: `${actorName} commented on your post: "${truncatedComment}"`,
        });
      } catch (error) {
        console.error("Error processing comment event:", error);
      }
    });

    // Handle mention events
    eventQueue.on("mention", async (event) => {
      try {
        const actor = await User.findById(event.actorId);
        // Use a fallback name if actor doesn't exist
        const actorName = actor ? actor.name : `User ${event.actorId}`;

        await Notification.create({
          userId: event.targetUserId,
          type: "mention",
          actorId: event.actorId,
          entityId: event.entityId,
          content: `${actorName} mentioned you in a post`,
        });
      } catch (error) {
        console.error("Error processing mention event:", error);
      }
    });

    // Handle job events
    eventQueue.on("job", async (event) => {
      try {
        // Safely access job metadata with fallbacks
        const title =
          event.metadata && event.metadata.title
            ? event.metadata.title
            : "a new position";
        const company =
          event.metadata && event.metadata.company
            ? event.metadata.company
            : "a company";

        await Notification.create({
          userId: event.targetUserId,
          type: "job",
          entityId: event.entityId,
          content: `New job matching your skills: ${title} at ${company}`,
        });
      } catch (error) {
        console.error("Error processing job event:", error);
      }
    });
  }

  async getNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const [notifications, unreadCount, total] = await Promise.all([
        Notification.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Notification.countDocuments({ userId, read: false }),
        Notification.countDocuments({ userId }),
      ]);

      return { notifications, unreadCount, total };
    } catch (error) {
      console.error("Error getting notifications:", error);
      return { notifications: [], unreadCount: 0, total: 0 };
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const result = await Notification.updateOne(
        { _id: notificationId, userId },
        { $set: { read: true } }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId, read: false },
        { $set: { read: true } }
      );

      return { success: true, count: result.modifiedCount };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return { success: false, count: 0 };
    }
  }
}

module.exports = new NotificationService();
