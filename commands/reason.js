const emBuilder = require('../functions/embedBuilder.js');
exports.run = async (client, message, args) => {
  const guild = message.guild;
  const modlog = guild.channels.get(client.serconf.get(guild.id).modLogId);
  const caseNumber = args.shift();
  const newReason = args.join(' ');
  await modlog.fetchMessages({limit: 100}).then((messages) => {
    const caseLog = messages.filter(m => m.author.id === client.user.id &&
      m.embeds[0] &&
      m.embeds[0].type === 'rich' &&
      m.embeds[0].footer &&
      m.embeds[0].footer.text.startsWith('Case') &&
      m.embeds[0].footer.text === `Case ${caseNumber}`
    ).first();
    modlog.fetchMessage(caseLog.id).then(logMsg => {
      const embed = logMsg.embeds[0];
      emBuilder.embedSan(embed);
      embed.description = embed.description.replace(`Awaiting moderator's input. Use ${client.serconf.get(guild.id).prefix}reason ${caseNumber} <reason>.`, newReason);
      logMsg.edit({embed});
    });
  });
};

exports.conf = {
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'reason',
  description: 'Updates a moderation case log.',
  usage: 'reason [-latest|case number] <Reason>',
  category: 'Moderation',
};
