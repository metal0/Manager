const data = require('../functions/dataProvider.js');
const emBuilder = require('../functions/embedBuilder.js');
exports.run = async (client, message, args) => {
  let msg = await message.channel.send('`Fetching data, please wait...`');
  const user = args.join(' ') || message.author.id;
  const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
  if (!match) return message.channel.send('Not Valid');
  let id = match[1];
  const history = await data.dbHistory(client, message, id);
  const embed = await emBuilder.buildHistoryLog(client, message, id, history);
  msg.edit({embed});
};

exports.conf = {
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'history',
  description: 'Pulls up moderation history for user.',
  usage: 'history <mention/userid>',
  category:'Moderation'
};
