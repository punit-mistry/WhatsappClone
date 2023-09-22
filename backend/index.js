const express = require('express');
const { Client,LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const client = new Client({
    authStrategy: new LocalAuth()
});
 

let isWhatsAppReady = false;

app.get('/qrcode', async (req, res) => {
  if (!isWhatsAppReady) {
    let qrData = '';

    // Create a promise to wait for the QR code generation
    const waitForQRCode = new Promise((resolve) => {
      // Generate and display the QR code in the terminal
      client.on('qr', (qr) => {
        console.log(qr);
        qrData = qr;
        qrcode.generate(qr, { small: true });
        
        // Resolve the promise once the QR code is generated
        resolve();
      });
    });

    // Listen for the 'authenticated' event to know when WhatsApp is ready
    client.on('authenticated', (session) => {
      console.log('WhatsApp authenticated');
      isWhatsAppReady = true; // Set WhatsApp as ready when authenticated

      // Send the QR code data as JSON once authenticated
      res.json({ qrCodeData: qrData });
    });


    // Initialize the WhatsApp client
    client.initialize();

    // Wait for the QR code to be generated before sending the response
    await waitForQRCode;
  } else {
    res.send(`
      <div class="flex gap-5">
        <input
          type="text"
          className="w-60 border-2 border-black h-10 p-2 rounded-lg"
          placeholder="Send WhatsApp Message.."
          id="messageInput"
        />
        <button
          className="bg-green-600 p-2 rounded-lg text-white font-bold"
          id="sendMessageButton"
        >
          💬 Send Message
        </button>
      </div>
    `);
  }
});


app.get('/chat/messages/:username', async (req, res) => {
  if (isWhatsAppReady) {
    try {
      const { username } = req.params;

      // Find the chat by username
      const chat = await client.getChatById(username);

      // Check if the chat exists
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
          FromMe:message.id.fromMe
        }));

        res.json(messageData);
      } else {
        res.status(404).send('Chat not found');
      }
    } catch (error) {
      console.error('Error retrieving chat messages:', error);
      res.status(500).send('Error retrieving chat messages.');
    }
  } else {
    res.status(400).send('WhatsApp is not yet ready.');
  }
});


app.post('/send-message', async (req, res) => {
  const { message, DriverNumbers } = req.body; // Assuming DriverNumbers is an array of numbers

  if (!Array.isArray(DriverNumbers) || DriverNumbers.length === 0) {
    return res.status(400).send('Invalid or empty list of numbers.');
  }

  if (isWhatsAppReady) {
    try {
      const results = await Promise.all(
        DriverNumbers.map(async (DriverNumber) => {
          try {
            await client.sendMessage(DriverNumber+'@c.us', message);
            return { number: DriverNumber, status: 'Message sent successfully!' };
          } catch (error) {
            console.error(`Error sending message to ${DriverNumber}:`, error);
            return { number: DriverNumber, status: 'Error sending message.' };
          }
        })
      );

      res.status(200).json(results);
    } catch (error) {
      console.error('Error sending messages:', error);
      res.status(500).send('Error sending messages.');
    }
  } else {
    res.status(400).send('WhatsApp is not yet ready.');
  }
});



// Define an API endpoint for retrieving the entire chat history
app.get('/chat/history', async (req, res) => {
  try {
    // Check if WhatsApp is ready
    if (isWhatsAppReady) {
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
    } else {
      res.status(400).send('WhatsApp is not yet ready.');
    }
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).send('Error retrieving chat history.');
  }
});
  



client.on('ready', () => {
  console.log('WhatsApp Client is ready!');
  //  client= new client
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
