const {RichEmbed} = require('discord.js');
const actions = {
  warn: { color: 0xFFFF00, display: 'Warn' },
  mute: { color: 0xFF9900, display: 'Mute' },
  kick: { color: 0xFF3300, display: 'Kick' },
  ban: { color: 0xFF0000, display: 'Ban' },
  unban: { color: 0x006699, display: 'Unban' },
  softban: { color: 0xFF2F00, display: 'Softban' }
};

async function embedSan(embed) {
  embed.message ? delete embed.message : null;
  embed.footer ? delete embed.footer.embed : null;
  embed.provider ? delete embed.provider.embed : null;
  embed.thumbnail ? delete embed.thumbnail.embed : null;
  embed.image ? delete embed.image.embed : null;
  embed.author ? delete embed.author.embed : null;
  embed.fields ? embed.fields.forEach(f => {delete f.embed;}) : null;
  return embed;
}


async function buildModLog(client, guild, caseNum, action, target, mod, reason) {
  const thisAction = actions[action];
  const embed = new RichEmbed()
    .setColor(thisAction.color)
    .setAuthor(`${mod.tag} (${mod.id})`)
    .setDescription(`**Action:** ${thisAction.display}\n**Target:** ${target.tag} (${target.id})\n**Reason:** ${reason}`)
    .setTimestamp()
    .setFooter(`Case ${caseNum}`);
  return await client.guilds.get(guild.id).channels.get(client.serconf.get(guild.id).modLogId).send({embed});
}

async function updateModLog() {

}

async function buildHistoryLog(client, message, target, history) {
  const user = await client.fetchUser(target);
  const embed = new RichEmbed()
    .setColor(0xFF0000)
    .setAuthor(user.tag, user.displayAvatarURL)
    .setDescription(history);
  return embed;
}
module.exports = {embedSan, buildModLog, updateModLog, buildHistoryLog};
