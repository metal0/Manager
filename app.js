// npm i discord.js body-parser ejs express express-session helmet marked passport passport-discord --save
const Discord = require('discord.js');
const client = new Discord.Client();
client.settings = require('./settings.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
client.serconf = new Discord.Collection();

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Loading Command: ${props.help.name}. ✔`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

fs.readdir('./events/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} events.`);
  files.forEach(file => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    log(`Loading Event: ${eventName}. ✔`);
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.elevation = message => {
  let permlvl = 0;
  if (client.settings.ownerId.includes(message.author.id)) return permlvl = 10;
  if (!message.guild) return permlvl;
  if (message.guild) {
    let modRole = message.guild.roles.find('name', client.serconf.get(message.guild.id).modRole);
    if (modRole && message.member.roles.has(modRole.id)) permlvl = 2;
    let adminRole = message.guild.roles.find('name', client.serconf.get(message.guild.id).adminRole);
    if (adminRole && message.member.roles.has(adminRole.id)) permlvl = 3;
    if (message.author.id === message.guild.owner.id) permlvl = 4;
  }
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
  console.log(chalk.bgRed(e));
});
client.login(client.settings.token);

process.on('unhandledRejection', error => {
  console.error(chalk.bgYellow.black(` [WARN] ${error.name}: ${error.message} `));
  console.error(error);
});