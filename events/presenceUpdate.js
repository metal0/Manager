const replied = new Set();
const reply = (member, message) => {
  if (!replied.has(member.id)) {
    replied.add(member.id);
    setTimeout(() => replied.delete(member.id), 2000);
    return member.send(message).catch(console.error);
  }
  return null;
};
const data = require('../functions/dataProvider.js');
const emBuilder = require('../functions/embedBuilder.js');
const util = require('../functions/util.js');

module.exports = async (client, oMember, nMember) => {
  const guild = nMember.guild;
  if (!guild) return;
  const fetchedGuild = client.serconf.get(guild.id);
  if (!fetchedGuild || !fetchedGuild.modLogId) return;
  const modlog = guild.channels.get(fetchedGuild.modLogId);
  if (!modlog) return console.log(util.lang('NO_MODLOG_CHAN', {action: 'kick'}));
  if (!guild.me.permissions.has('KICK_MEMBERS')) return console.log(util.lang('NO_PERMS', {permission: 'KICK_MEMBERS'}));
  const caseNumber = await modlog.fetchMessages({ limit: 5 }).then((messages) => {
    const log = messages.filter(m => m.author.id === client.user.id
      && m.embeds[0]
      && m.embeds[0].type === 'rich'
      && m.embeds[0].footer
      && m.embeds[0].footer.text.startsWith('Case')
    ).first();
    if(!log) return 1;
    const thisCase = /Case\s(\d+)/.exec(messages.first().embeds[0].footer.text);
    return thisCase ? parseInt(thisCase[1]) + 1 : 1;
  });

  if (nMember.presence.game !== null && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(nMember.user.presence.game.name)) {
    if (nMember.kickable) {
      await reply(nMember, 'You have triggered an automated kick response due to having a discord guild invite link in your `Playing:` field.\n\nPlease remove this link a.s.a.p. as it is breaking **Rule #1** _Advertising_. If you wish to re-join the guild _without_ being kicked, please remove the invite link from your `Playing:` field.');
      console.log(`Kicking ${nMember.user.tag} for having \`${nMember.user.presence.game.name}\` in playing field`);
      await nMember.kick('Invite link in `Playing:` field.').catch(console.error);
      await data.dbInsertMod(client, guild, caseNumber, 'kick', nMember.user, client.user, 'Automated Response to Invite Code in `Playing` field.');
      if (modlog)
        await emBuilder.buildModLog(client, guild, caseNumber, 'kick', nMember.user, client.user, 'Automated Response to Invite Code in `Playing` field.');
      return;
    }
    console.log(`DM'ing ${nMember.user.tag} for having \`${nMember.user.presence.game.name}\` in playing field`);
    await reply(nMember, 'You have triggered an automated response due to having a discord guild invite link in your `Playing:` field.\n\nPlease remove this link a.s.a.p. as it is breaking **Rule #1** _Advertising_.\n\nFailure to do so will result in a kick or possibly a ban.');
    await data.dbInsertMod(client, guild, caseNumber, 'warn', nMember.user, client.user, 'Automated Response to Invite Code in `Playing` field.');
    if (modlog)
      await emBuilder.buildModLog(client, guild, caseNumber, 'warn', nMember.user, client.user, 'Automated Response to Invite Code in `Playing` field.');
    return;
  }
};
