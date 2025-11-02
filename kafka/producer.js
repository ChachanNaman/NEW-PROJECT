/**
 * Kafka Producer for Real-time Rating Events
 * Streams user rating events to Kafka for real-time processing
 */

const kafka = require('kafkajs');
const axios = require('axios');

// Kafka configuration
const client = kafka({
  clientId: 'recohub-producer',
  brokers: ['localhost:9092']
});

const producer = client.producer();

const RATING_TOPIC = 'user-ratings';
const ACTIVITY_TOPIC = 'user-activities';

/**
 * Send rating event to Kafka
 */
async function sendRatingEvent(userId, contentType, contentId, rating) {
  try {
    await producer.send({
      topic: RATING_TOPIC,
      messages: [{
        key: userId,
        value: JSON.stringify({
          userId,
          contentType,
          contentId,
          rating,
          timestamp: new Date().toISOString()
        })
      }]
    });
    console.log(`Rating event sent: User ${userId} rated ${contentType} ${contentId} with ${rating}`);
  } catch (error) {
    console.error('Error sending rating event:', error);
  }
}

/**
 * Send user activity event to Kafka
 */
async function sendActivityEvent(userId, activityType, contentId) {
  try {
    await producer.send({
      topic: ACTIVITY_TOPIC,
      messages: [{
        key: userId,
        value: JSON.stringify({
          userId,
          activityType, // 'view', 'click', 'search', etc.
          contentId,
          timestamp: new Date().toISOString()
        })
      }]
    });
    console.log(`Activity event sent: User ${userId} ${activityType} ${contentId}`);
  } catch (error) {
    console.error('Error sending activity event:', error);
  }
}

/**
 * Connect producer
 */
async function connect() {
  await producer.connect();
  console.log('Kafka producer connected');
}

/**
 * Disconnect producer
 */
async function disconnect() {
  await producer.disconnect();
  console.log('Kafka producer disconnected');
}

module.exports = {
  sendRatingEvent,
  sendActivityEvent,
  connect,
  disconnect
};

// Example usage (integrate with Express routes)
/*
const kafkaProducer = require('./kafka/producer');

// In your rating route
router.post('/ratings', auth, async (req, res) => {
  // ... existing rating logic ...
  
  // Send to Kafka
  await kafkaProducer.sendRatingEvent(
    req.user._id,
    req.body.contentType,
    req.body.contentId,
    req.body.rating
  );
  
  res.json(userRating);
});
*/

