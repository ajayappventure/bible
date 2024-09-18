const env = {
  REGION: process.env.REGION,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_KEY_ID: process.env.SECRET_KEY_ID,
  USERPOOL_ID: process.env.USERPOOL_ID,
  CLIENT_ID: process.env.CLIENT_ID,
  SALT_ROUND: process.env.SALT_ROUND,
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI,
  GMAIL_SCOPE: process.env.GMAIL_SCOPE,
};

module.exports = { env };
