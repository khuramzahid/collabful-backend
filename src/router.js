const Router = require('express').Router;
const tokenGenerator = require('./token_generator');

const router = new Router();

router.get('/token', (req, res) => {
  const token = tokenGenerator(undefined);
  res.send(token);
});

router.get('/config', (req, res) => {
  res.json({
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY: process.env.TWILIO_API_KEY,
    TWILIO_API_SECRET: process.env.TWILIO_API_SECRET,
    TWILIO_CHAT_SERVICE_SID: process.env.TWILIO_CHAT_SERVICE_SID,
    TWILIO_NOTIFICATION_SERVICE_SID: process.env.TWILIO_NOTIFICATION_SERVICE_SID,
    TWILIO_SYNC_SERVICE_SID: process.env.TWILIO_SYNC_SERVICE_SID || 'default'
  });
});

module.exports = router;
