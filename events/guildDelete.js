const dataP = require('../functions/dataProvider.js');
module.exports = (client, guild) => {
  if(guild.available) {
    client.serconf.delete(guild.id);
    dataP.dbDeleteConfs(guild.id, guild.name);
  } else {
    console.log('Shit outta luck');
  }
};
