const {promisifyAll} = require('tsubaki');
const database = require('nedb-core');
promisifyAll(database.prototype);
const modlogs = new database({filename: './database/modlogs.db', autoload: true});
const confs = new database({filename: './database/confs.db', autoload:true});

/*  Searches modlog cases */
async function dbFindMod(client, message, target) {
  const searchTerm = target || '';
  const guildID = message.guild.id;
  const results = await modlogs.countAsync({guildID: guildID, targetID:searchTerm});
  console.log(results);
  return results;
}

async function dbHistory(client, message, target) {
  const searchTerm = target || '';
  const guildID = message.guild.id;
  const warnCount = await modlogs.countAsync({guildID: guildID, targetID:searchTerm, action:'warn'});
  const muteCount = await modlogs.countAsync({guildID: guildID, targetID:searchTerm, action:'mute'});
  const kickCount = await modlogs.countAsync({guildID: guildID, targetID:searchTerm, action:'kick'});
  const softCount = await modlogs.countAsync({guildID: guildID, targetID:searchTerm, action:'softban'});
  const bannCount = await modlogs.countAsync({guildID: guildID, targetID:searchTerm, action:'ban'});
  const warns = warnCount === 1 ? 'warning' : 'warnings';
  const mutes = muteCount === 1 ? 'mute' : 'mutes';
  const kicks = kickCount + softCount === 1 ? 'kick' : 'kicks';
  // const softs = softCount === 1 ? 'softban' : 'softbans';
  const banns = bannCount === 1 ? 'ban' : 'bans';
  return `This user has ${warnCount} ${warns}, ${muteCount} ${mutes}, ${kickCount + softCount} ${kicks}, and ${bannCount} ${banns}.`;
}

/*  Creates a modlog case  */
async function dbInsertMod(client, guild, caseID, action, target, moderator, reason) {
  let reasonResult = reason ? reason : `Awaiting moderator's input. Use \`$reason ${caseID} <reason>.\``;
  let dataBuilder = {
    guild: guild.id,
    caseID: caseID,
    action: action,
    targetID: target.id,
    targetRaw: target.tag,
    guildID: guild.id,
    guildName: guild.name,
    mod: `${moderator.tag} (${moderator.id})`,
    reason: reasonResult,
    timestamp: new Date().getTime()
  };
  await modlogs.insertAsync(dataBuilder);

}

/*  Updates a modlog case  */
async function dbUpdateMod(client, message, target, newReason) {
  const guildID = message.guild.id;
  await modlogs.updateAsync({guildID: guildID, target: target}, {$set: {reason: newReason}});
  let msg = await message.channel.send('Log updated 👍');
  return msg.delete(10000);
}

/*  Deletes a modlog case */
async function dbDeleteMod() {

}

/*  SERVER CONFIGURATIONS */

/*  To be used in the ready event  */
async function dbLoadConfs(guildID) {
  return confs.findOneAsync({guildID: guildID});
}

/*  This writes the config data to the confs.db  */
async function dbCreateConfs(data) {
  await confs.insertAsync(data);
}

/*  This deletes the config data from the confs.db  */
async function dbDeleteConfs(guildID, guildName) {
  try {
    await confs.removeAsync({guildID}, {multi: true});
    await confs.loadDatabase();
    console.log(`${guildName} successfully removed.`);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  modlogs,
  dbFindMod,
  dbInsertMod,
  dbUpdateMod,
  dbDeleteMod,
  dbHistory,
  confs,
  dbLoadConfs,
  dbCreateConfs,
  dbDeleteConfs
};
