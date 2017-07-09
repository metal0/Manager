const chalk = require('chalk');
const dataP = require('../functions/dataProvider.js');
const util = require('../functions/util.js');
module.exports = (client) => {
  // require('../functions/dashboard.js').init(client);
  dataP.confs.loadDatabase();
  console.log(util.lang('CHECK_POPULATE', {}));
  client.guilds.forEach(guild => {
    dataP.dbLoadConfs(guild.id).then(data => {
      let defaultConf = {guildID: guild.id, guildName: guild.name, adminRole: 'Admin', modRole: 'Mod', prefix: 'c!', modLogId: '', banAppealId:'', muteThres: 6, kickThres: 8, banThres: 10, dmOnMute: true, dmOnKick: true, dmOnSoft: true, dmOnBan: true, antiInvite: false};
      if (!data) {

        console.log(util.lang('ADD_DEFAULT', {name: guild.name}));

        client.serconf.set(guild.id, defaultConf);
        dataP.dbCreateConfs(defaultConf);
      } else {
        let loadedData = {guildID: data.guildID, guildName: data.guildName, adminRole: data.adminRole, modRole: data.modRole, prefix: data.prefix, modLogId: data.modLogId, banAppealId: data.banAppealId, muteThres: data.muteThres, kickThres: data.kickThres, banThres: data.banThres, dmOnMute: data.dmOnMute, dmOnKick: data.dmOnKick, dmOnSoft: data.dmOnSoft, dmOnBan: data.dmOnBan, antiInvite: data.antiInvite};

        console.log(util.lang('LOAD_COLLECTION', {name: guild.name}));

        client.serconf.set(guild.id, loadedData);
      }
    });
  });
  console.log(chalk.green('I\'m Online'));
};
