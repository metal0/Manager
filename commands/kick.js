const data = require('../functions/dataProvider.js');
const emBuilder = require('../functions/embedBuilder.js');
const util = require('../functions/util.js');
exports.run = async (client, message, args) => {
  const guild = message.guild;
  const target = message.mentions.users.first();
  const modlog = guild.channels.get(client.serconf.get(guild.id).modLogId);

  try {
    if (!modlog) return message.reply(util.lang('NO_MODLOG_CHAN', {action: 'kick'}));
    if (!guild.me.permissions.has('KICK_MEMBERS')) return message.reply(util.lang('NO_PERMS', {permission: 'KICK_MEMBERS'}));
    if (!target) return message.reply(util.lang('NO_TARGET', {action: 'kick'}));
    if (!guild.member(target).kickable) return message.reply(util.lang('CANNOT_MOD', {action: 'kickable'}));

    const caseNumber = await util.caseNumber(client, modlog);

    const reason = args.splice(1, args.length).join(' ') || util.lang('AWAIT_INPUT', {prefix: client.serconf.get(guild.id).prefix, caseNum: caseNumber});
    if (client.serconf.get(guild.id).dmOnKick && reason.length > 0)
      await target.send(util.lang('MSG_DM_KICK', {guildName: guild.name, reason: reason}));
    // await guild.member(target).kick(`${reason || 'No reason supplied'}`);
    await data.dbInsertMod(client, guild, caseNumber, 'kick', target, message.author, reason);
    if (modlog)
      await emBuilder.buildModLog(client, guild, caseNumber, 'kick', target, message.author, reason);
    await message.reply(util.lang('SUCCESS', {action: 'kicked', target: target.tag}));
  } catch (e) {
    if (e.message === 'Cannot send messages to this user') {
      await message.channel.send(util.lang('CANNOT_DM', {target: target.tag}));
    } else {
      console.log(e);
    }
  }
};

exports.conf = {
  enabled: true,
  aliases: ['boot', 'toss'],
  permLevel: 2
};

exports.help = {
  name: 'kick',
  description: 'Kicks the mentioned user.',
  usage: 'kick <mention> [reason]',
  category: 'Moderation',
  subCategory: ''
};
