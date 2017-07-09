const data = require('../functions/dataProvider.js');
const emBuilder = require('../functions/embedBuilder.js');
const util = require('../functions/util.js');
exports.run = async (client, message, args) => {
  const guild = message.guild;
  const target = message.mentions.users.first();
  const modlog = guild.channels.get(client.serconf.get(guild.id).modLogId);
  const reason = args.splice(1, args.length).join(' ');
  try {
    if (!modlog) return message.reply(util.lang('NO_MODLOG_CHAN', {action: 'warn'}));
    if (!guild.me.permissions.has('MANAGE_ROLES')) return message.reply(util.lang('NO_PERMS', {permission: 'MANAGE_ROLES'}));
    if (!target) return message.reply(util.lang('NO_TARGET', {action: 'warn'}));
    if (reason.length < 1) return message.reply(util.lang('SUPPLY_REASON', {action: 'warn'}));

    const caseNumber = await util.caseNumber(client, modlog);

    await data.dbInsertMod(client, guild, caseNumber, 'warn', target, message.author, reason);
    if (modlog)
      await emBuilder.buildModLog(client, guild, caseNumber, 'warn', target, message.author, reason);
    await message.reply(util.lang('SUCCESS', {action: 'warned', target: target.username}));
  } catch (e) {
    if (e.message === 'Cannot send messages to this user') {
      await message.channel.send(util.lang('CANNOT_DM', {target: target.username}));
    } else {
      console.log(e);
    }
  }
};

exports.conf = {
  enabled: true,
  aliases: ['caution'],
  permLevel: 2
};

exports.help = {
  name: 'warn',
  description: 'Warns the mentioned user.',
  usage: 'warn <mention> <reason>',
  category: 'Moderation',
  subCategory: ''
};
