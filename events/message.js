const util = require('../functions/util.js');
module.exports = async (client, message) => {
  if (message.channel.type === 'dm' && message.content.startsWith('appeal')) {
    return console.log('Success');
  } else
  // util.antiInvite(message);
  if (!message.guild
    || !message.content.startsWith(client.serconf.get(message.guild.id).prefix)
    || message.author.bot
    || message.author.id === client.user.id
    || !message.member
  ) return;
  const params = message.content.split(' ');
  const command = params.shift().slice(client.serconf.get(message.guild.id).prefix.length);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }

};
// client.serconf.find('guildID', message.guild.id)
