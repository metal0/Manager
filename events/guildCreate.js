const dataP = require('../functions/dataProvider.js');
module.exports = (client, guild) => {
  let defaultConf = {guildID: guild.id, adminRole: 'Admin', modRole: 'Mod', prefix: 'c!', modLogId: '', banAppealId:'', muteThres: 6, dmOnMute:false, kickThres: 8, dmOnKick: false, banThres: 10, dmOnBan: false, antiInvite: false};
  console.log(`New Guild ${guild.name} added to database.`);
  client.serconf.set(guild.id, defaultConf);
  dataP.dbCreateConfs(defaultConf);
};
