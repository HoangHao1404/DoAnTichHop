const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

async function sendResetLink(email, resetUrl) {
  const clientId = process.env.GMAIL_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const sender = process.env.GMAIL_USER;

  if (!clientId || !clientSecret || !refreshToken || !sender) {
    throw new Error(
      "Gmail API is not configured. Set GMAIL_REFRESH_TOKEN and GMAIL_USER (and Gmail OAuth client credentials).",
    );
  }

  const oauthClient = new OAuth2Client(clientId, clientSecret);
  oauthClient.setCredentials({ refresh_token: refreshToken });
  const { token: accessToken } = await oauthClient.getAccessToken();

  if (!accessToken) {
    throw new Error("Could not obtain a Gmail API access token");
  }

  const message = [
    `To: ${email}`,
    `From: ${sender}`,
    "Subject: Reset your password",
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>`,
  ].join("\r\n");
  const raw = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await axios.post(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    { raw },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
}

module.exports = { sendResetLink };
