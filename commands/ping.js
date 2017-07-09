exports.run = (client, message) => {
  message.channel.send('Ping?').then(m => m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`) );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'Ping/Pong command. I wonder what this does? /sarcasm',
  usage: 'ping',
  category:'Generic',
  subCategory:''
};
