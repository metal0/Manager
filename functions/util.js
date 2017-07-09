const moment = require('moment');

function lang(key, data) {
// Function originally created by Zajrik#2656 (214628307201687552)
  const strings = require('../lang/en/enUS.json');
  let loadedString = strings[key];
  if (typeof data === 'undefined') return loadedString;
  for (const token of Object.keys(data))
    loadedString = loadedString.replace(new RegExp(`{{ *${token} *}}`, 'g'), data[token]);
  return loadedString;
}

function antiInvite(message) {
  if (/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(message.content)) {
    message.delete();
    message.reply('your message contained a server invite link, which this server prohibits');
  }
  console.log(message.content);
}

function logAction(type, id, message, details) {
  let time = moment().format('YYYY-MM-DD HH:mm:ss');
  details = details && details.length > 0 ? `\n \`\`\`${details}\`\`\`` : '';
  return console.log(`\`[${time}][${id}][${type}]\` ${message}${details}`);
}

function banMember(message, type) {// eslint-disable-line no-unused-vars

}

async function caseNumber(client, modlog) {
  const messages = await modlog.fetchMessages({limit: 5});
  const log = messages.filter(m => m.author.id === client.user.id
    && m.embeds[0]
    && m.embeds[0].type === 'rich'
    && m.embeds[0].footer
    && m.embeds[0].footer.text.startsWith('Case')
  ).first();
  if (!log) return 1;
  const thisCase = /Case\s(\d+)/.exec(log.embeds[0].footer.text);
  return thisCase ? parseInt(thisCase[1]) + 1 : 1;
}

module.exports = {lang, antiInvite, logAction, banMember, caseNumber};
