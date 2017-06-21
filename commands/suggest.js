const Discord = require('discord.js');
const settings = require('../settings.json');
exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let invite = args.slice(2).join(' ');
  let user = args.slice(3).join(' ');
  let suggestionchannel = message.guild.channels.find('name', 'bot-suggestions');
  if (!suggestionchannel) return message.reply('I cannot find a channel to send this to!');
  if (reason.length < 1) return message.reply('You have to give me an invite link silly!');

  const embed = new Discord.RichEmbed()
    .setColor(0xFF0000)
    .setTimestamp()
    .addField('New Bot!', `Suggested Bot!`)
    .addField('Bot Name:', user)
    .addField('Suggesting User:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Why should we add the bot?', reason)
    .addField('Invite Link', invite);
    client.channels.get(suggestionchannel.id).send(`<:bot:${settings.bot}> Looks like we've got a new suggestion!`)
  return client.channels.get(suggestionchannel.id).send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'suggest',
  description: 'Sends the new bot messages.',
  usage: 'suggest [bot] [reason] [invite]'
};
