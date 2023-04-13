const PastebinAPI = require('pastebin-js');
const { WAConnection } = require('@adiwajshing/baileys');
const qr = require('qrcode');
const ImgurClient = require('imgur');
const fs = require('fs');

const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL'); // Replace with your own API key
const conn = new WAConnection();

// Connect to WhatsApp
conn.connect();

// Get the session code and generate a QR code image
conn.on('open', async () => {
  const sessionCode = conn.base64EncodedAuthInfo();
  const qrCode = await qr.toDataURL(sessionCode, { scale: 8 });

  // Upload the QR code image to Imgur
  const imgur = new ImgurClient({ clientId: '05bc579b93fd74d' }); // Replace with your own Imgur client ID
  const image = await imgur.uploadBase64(qrCode.replace(/^data:image\/png;base64,/, ''));

  // Create a new paste on Pastebin with the WhatsApp session code
  const pasteText = `${sessionCode}`;
  pastebin.createPaste({
    'text': pasteText,
    'title': 'WhatsApp session code and QR code',
    'format': 'text'
  })
  .then(data => {
    console.log(`Paste created: ${data}`);

    // Send the paste URL to your WhatsApp account
    conn.sendMessage('your_own_whatsapp_number@c.us', {
      url: data
    }, 'url');

    // Download the QR code image to a file
    const file = fs.createWriteStream('qrcode.png');

    response.data.pipe(file);
  })
  .catch(err => console.error(err));
});




<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>WhatsApp QR code</title>
</head>
<body>
  <img src="qrcode.png" alt="WhatsApp QR code">
</body>
</html>
