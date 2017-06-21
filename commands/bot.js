const Discord = require('discord.js');
const settings = require('../settings.json');
exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  if (message.mentions.users.size < 1) return message.reply('You must mention a bot!')
  let logchannel = message.guild.channels.find('name', 'bot-additions');
  if (!logchannel) return message.reply('I cannot find a channel to send this to!');
  if (reason.length < 1) return message.reply('You have to give me an invite link silly!');

  const embed = new Discord.RichEmbed()
    .setColor(0xFF0000)
    .setTimestamp()
    .addField('New Bot!', `New Bot!`)
    .addField('Bot Name:', `${user.username}#${user.discriminator}`)
    .addField('Adding User:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Invite Link', reason);
    client.channels.get(logchannel.id).send(`<:bot:${settings.bot}> Looks like we've got a new bot!`)
  return client.channels.get(logchannel.id).send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'bot',
  description: 'Sends the new bot messages.',
  usage: 'bot [bot] [invite]'
};
