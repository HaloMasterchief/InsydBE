// services/eventQueue.js
class EventQueue {
  constructor() {
    this.queue = [];
    this.handlers = new Map();
    this.processing = false;
  }

  // Register a handler for a specific event type
  on(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType).push(handler);
  }

  // Add event to queue
  publish(event) {
    this.queue.push({
      ...event,
      timestamp: new Date(),
    });

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }

    return true;
  }

  // Process events in the queue
  async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const event = this.queue.shift();

    try {
      const handlers = this.handlers.get(event.type) || [];
      const globalHandlers = this.handlers.get("*") || [];

      const allHandlers = [...handlers, ...globalHandlers];

      for (const handler of allHandlers) {
        await handler(event);
      }
    } catch (error) {
      console.error("Error processing event:", error);
      // In a real system, would implement retry logic or dead-letter queue
    }

    // Continue processing the queue
    setImmediate(() => this.processQueue());
  }
}

// Singleton instance
const eventQueue = new EventQueue();
module.exports = eventQueue;
