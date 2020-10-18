const Twilio = require('twilio');
require('dotenv').config();
const nameGenerator = require('../name_generator');
const AccessToken = Twilio.jwt.AccessToken;

const tokenGenerator = (identity = 0) => {
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  token.identity = identity || nameGenerator();

  //const videoGrant = new AccessToken.VideoGrant();
  //token.addGrant(videoGrant);

  const chatGrant = new AccessToken.ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID
  });
  token.addGrant(chatGrant);

  return {
    identity: token.identity,
    token: token.toJwt()
  };
}

module.exports = tokenGenerator;
