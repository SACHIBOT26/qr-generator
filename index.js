const express = require('express');
const qrcode = require('qrcode');
const { WAConnection, MessageType } = require('@adiwajshing/baileys');

const app = express();

const conn = new WAConnection();

conn.on('qr', async (qrContent) => {
  const qrImage = await qrcode.toDataURL(qrContent);
  console.log(qrContent); // Output the QR code content to the console
  app.get('/', (req, res) => {
    res.send(`<img src="${qrImage}" alt="WhatsApp QR code">`);
  });
});

conn.connect();

conn.on('open', async () => {
  const session = conn.base64EncodedAuthInfo(); // Get session information
  const message = `Here is your session code:\n\n${JSON.stringify(session, null, 2)}`; // Create message to send
  const chatId = conn.user.id; // Replace with the connected number's chat ID
  await conn.sendMessage(chatId, message, MessageType.text); // Send message
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`App running on port ${process.env.PORT || 3000}`);
});
