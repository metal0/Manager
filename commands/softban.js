const data = require('../functions/dataProvider.js');
const emBuilder = require('../functions/embedBuilder.js');
const util = require('../functions/util.js');
exports.run = async (client, message, args) => {
  const guild = message.guild;
  const target = message.mentions.users.first();
  const modlog = guild.channels.get(client.serconf.get(guild.id).modLogId);

  try {
    if (!modlog) return message.reply(util.lang('NO_MODLOG_CHAN', {action: 'softban'}));
    if (!guild.me.permissions.has('BAN_MEMBERS')) return message.reply(util.lang('NO_PERMS', {permission: 'BAN_MEMBERS'}));
    if (!target) return message.reply(util.lang('NO_TARGET', {action: 'softban'}));
    if (!guild.member(target).bannable) return message.reply(util.lang('CANNOT_MOD', {action: 'bannable'}));

    const caseNumber = await util.caseNumber(client, modlog);

    const reason = args.splice(1, args.length).join(' ') || util.lang('AWAIT_INPUT', {prefix: client.serconf.get(guild.id).prefix, caseNum: caseNumber});
    if (client.serconf.get(guild.id).dmOnBan && reason.length > 0)
      await target.send(util.lang('MSG_DM_SOFTBAN', {guildName: guild.name, reason: reason}));
    await guild.ban(target, {days:2, reason: `${reason || 'No reason supplied'}`});
    await guild.unban(target);

    await data.dbInsertMod(client, guild, caseNumber, 'softban', target, message.author, reason);
    if (modlog)
      await emBuilder.buildModLog(client, guild, caseNumber, 'softban', target, message.author, reason);
    await message.reply(util.lang('SUCCESS', {action:'soft-banned', target:target.username}));
  } catch(e) {
    if (e.message === 'Cannot send messages to this user') {
      await message.channel.send(util.lang('CANNOT_DM', {target:target.username}));
    } else {
      console.log(e);
    }
  }
};

exports.conf = {
  aliases: ['gentlebanne'],
  permLevel: 2
};

exports.help = {
  name: 'softban',
  description: 'softbans the mentioned user.',
  usage: 'softban <mention> [reason]',
  category:'Moderation'
};
