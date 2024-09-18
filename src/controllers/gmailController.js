const { google } = require("googleapis");
const fs = require("fs");
const { env } = require("../constant/environment");

const oAuth2Client = new google.auth.OAuth2(
  env.GMAIL_CLIENT_ID,
  env.GMAIL_CLIENT_SECRET,
  env.GMAIL_REDIRECT_URI,
);

// Store tokens securely (use a database or secure storage in production)
let tokens = {};
//Authorize Gmail API
const authGmail = async (req, res) => {
  const url = await oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [process.env.GMAIL_SCOPE],
  });
  res.send(`<a href="${url}">Authorize Gmail API</a>`);
};

//redirect URl
const oauth2callback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens: newTokens } = await oAuth2Client.getToken(code);
    tokens = newTokens;
    oAuth2Client.setCredentials(newTokens);
    //
    fs.writeFileSync("tokens.json", JSON.stringify(newTokens));
    res.send("Authorization successful! You can now close this tab.");
  } catch (error) {
    console.error(
      "Error during OAuth2 callback:",
      error.response ? error.response.data : error.message,
    );
    res.status(500).send("Authorization failed. Please try again.");
  }
};

//get emails
const emailList = async (req, res) => {
  try {
    let tokens;

    // Read tokens from file if it exists
    if (fs.existsSync("tokens.json")) {
      tokens = JSON.parse(fs.readFileSync("tokens.json"));
    }

    if (!tokens || !tokens.access_token) {
      resstatus(400).send("No access token found. Please authenticate first.");
      return;
    }

    oAuth2Client.setCredentials(tokens);
    const gmail = await google.gmail({ version: "v1", auth: oAuth2Client });

    // Pagination parameters
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of emails per page
    const pageToken = req.query.pageToken || null; // Token for the next page

    try {
      // Retrieve list of messages with pagination
      const response = await gmail.users.messages.list({
        userId: "me",
        maxResults: pageSize,
        pageToken: pageToken,
      });

      const messages = response.data.messages || [];
      const nextPageToken = response.data.nextPageToken;

      // Fetch details of each message
      const messageDetails = await Promise.all(
        messages.map(async (message) => {
          const messageResponse = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
            format: "full", // Can be 'minimal', 'full', 'raw', 'metadata'
          });

          // Decode email content
          const parts = messageResponse.data.payload.parts || [];
          let emailContent = "";
          if (parts.length) {
            // Find the part with the 'text/plain' mime type
            for (const part of parts) {
              if (
                part.mimeType === "text/plain" &&
                part.body &&
                part.body.data
              ) {
                emailContent = Buffer.from(part.body.data, "base64").toString(
                  "utf8",
                );
                break;
              }
            }
          }

          return {
            id: message.id,
            snippet: messageResponse.data.snippet,
            content: emailContent,
          };
        }),
      );

      // Send response including nextPageToken
      res.json({
        messages: messageDetails,
        nextPageToken: nextPageToken || null, // Send nextPageToken to the client
      });
    } catch (error) {
      console.error("Error retrieving emails:", error);
      res.status(500).send("Error retrieving emails");
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Error processing request");
  }
};
module.exports = {
  authGmail,
  oauth2callback,
  emailList,
};
