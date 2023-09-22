const { Client,LocalAuth  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


const client = new Client({
    authStrategy: new LocalAuth()
});
 

client.on('qr', (qr) => {
    console.log(qr);
    qrData = qr;
    qrcode.generate(qr, { small: true });
  });

  client.on('authenticated', (session) => {
    console.log('WhatsApp authenticated');
  });
  

  client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
