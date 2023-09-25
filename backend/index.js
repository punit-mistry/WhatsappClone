const express = require('express');
const { Client,LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const clients = {};

let isWhatsAppReady = {
  Name:"",
  ready: false, 
};

app.post('/qrcode', async (req, res) => {
  const { clientName } = req.body;

  if (!clientName) {
    return res.status(400).json({ error: 'Client name is required in the request body.' });
  }

  if (!clients[clientName]) {
    console.log(`Initializing client for ${clientName}`);
    clients[clientName] = {
      instance: new Client({
        authStrategy: new LocalAuth({ clientId: clientName }),
      }),
      isWhatsAppReady: false,
    };
    isWhatsAppReady=true;
    clients[clientName].instance.on('qr', (qr) => {
      console.log(qr);
      qrcode.generate(qr, { small: true });

      // Send the QR code data to the client
      console.log(`Sending QR code data for ${clientName}`);
      res.json({ qrCodeData: qr });
    });

    clients[clientName].instance.on('authenticated', (session) => {
      console.log(`${clientName} authenticated`);
      clients[clientName].isWhatsAppReady = true;

      // After authentication, you can choose to send a different response if needed
      console.log(`WhatsApp for ${clientName} is already ready.`);
  
    });

    clients[clientName].instance.initialize();
  } else {
   
      // Send an empty JSON object to indicate that the client is not ready yet
      console.log(`Client ${clientName} is not yet ready.`);
      res.status(200).json({qrCodeData:``});
  }
});




app.get('/chat/messages/:clientName/:username', async (req, res) => {
  const { clientName, username } = req.params;
console.log(clients)
  if (!clientName) {
    return res.status(400).json({ error: 'Client name is required in the request parameters.' });
  }

  if (!clients[clientName] || !clients[clientName].isWhatsAppReady) {
    return res.status(400).json({ error: `WhatsApp for ${clientName} is not yet ready.` });
  }

  try {
    const client = clients[clientName].instance;
    const chat = await client.getChatById(username);

    if (chat) {
      // Define search options to retrieve messages
      const searchOptions = {
        limit: 10, // Number of messages to retrieve (adjust as needed)
      };

      // Fetch messages from the chat
      const messages = await chat.fetchMessages(searchOptions);

      // Extract relevant message information
      const messageData = messages.map((message) => ({
        id: message.id.id,
        content: message.body,
        timestamp: message.timestamp,
        FromMe: message.id.fromMe,
      }));

      res.json(messageData);
    } else {
      res.status(404).send('Chat not found');
    }
  } catch (error) {
    console.error(`Error retrieving chat messages for ${clientName}:`, error);
    res.status(500).json({ error: `Error retrieving chat messages for ${clientName}.` });
  }
});


app.post('/send-message', async (req, res) => {
  const { clientName, message, DriverNumbers } = req.body; // Assuming DriverNumbers is an array of numbers

  if (!clientName) {
    return res.status(400).json({ error: 'Client name is required in the request body.' });
  }

  if (!Array.isArray(DriverNumbers) || DriverNumbers.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty list of numbers.' });
  }

  if (!clients[clientName] || !clients[clientName].isWhatsAppReady) {
    return res.status(400).json({ error: `WhatsApp for ${clientName} is not yet ready.` });
  }

  try {
    const client = clients[clientName].instance;
    const results = await Promise.all(
      DriverNumbers.map(async (DriverNumber) => {
        try {
          await client.sendMessage(DriverNumber + '@c.us', message);
          return { number: DriverNumber, status: 'Message sent successfully!' };
        } catch (error) {
          console.error(`Error sending message to ${DriverNumber}:`, error);
          return { number: DriverNumber, status: 'Error sending message.' };
        }
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error(`Error sending messages for ${clientName}:`, error);
    res.status(500).json({ error: `Error sending messages for ${clientName}.` });
  }
});




app.get('/chat/history', async (req, res) => {
  const { clientName } = req.query;

  if (!clientName) {
    return res.status(400).json({ error: 'Client name is required as a query parameter.' });
  }

  if (!clients[clientName] || !clients[clientName].isWhatsAppReady) {
    return res.status(400).json({ error: `WhatsApp for ${clientName} is not yet ready.` });
  }

  try {
    const client = clients[clientName].instance;
    const chats = await client.getChats();
    let chatHistory = [];

    // Define your Options for message retrieval here
    const Options = {
      limit: 10, // Number of messages to retrieve per chat (adjust as needed)
    };

    for (const chat of chats) {
      const messages = await chat.fetchMessages(Options);

      const allMessages = messages.map((message) => ({
        id: message.id.id,
        content: message.body,
        timestamp: message.timestamp,
        from: message.id.fromMe,
      }));

      chatHistory.push({
        chatId: chat.name, // Use chat.name or chat.id._serialized depending on your needs
        number: chat.id,
        isGroup: chat.isGroup,
        messages: allMessages,
      });
    }

    res.json(chatHistory);
  } catch (error) {
    console.error(`Error retrieving chat history for ${clientName}:`, error);
    res.status(500).json({ error: `Error retrieving chat history for ${clientName}.` });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
