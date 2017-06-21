const settings = require('../settings.json');
exports.run = (client, message, args) => {
  let member = message.guild.member(message.mentions.users.first());
  if (!member) return message.reply(`<:redTick:${settings.redTick} That bot does not seem valid.`);
  if(message.mentions.users.size === 0) {
    return message.reply(`<:redTick:${settings.redTick} Please mention a bot to verify.`)
  } else {
    member.addRole('326889379157245953').then(message.channel.send(`Successfully added the role of Bot to ${member}.`))
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'verifybot',
  description: 'Verifies a bot.',
  usage: 'verify @bot'
};
