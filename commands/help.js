const help = require('../data/helpMsgs.json');
exports.run = (client, message) => {
  if (message.channel.id === "166304313004523520") {
        message.channel.send(help.helpMsg1);
        setTimeout(() => {
          message.channel.send(help.helpMsg2);
        }, 250);
        setTimeout(() => {
          message.channel.send(help.helpMsg3);
       }, 500);
     } else {
       message.channel.send(help.helpMsg1);
       setTimeout(() => {
         message.channel.send(help.helpMsg3);
       }, 250);
    }
  }

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};
