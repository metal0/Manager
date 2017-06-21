const chalk = require('chalk');
module.exports = client => {
  client.user.setGame(`with my fellow bots!`);
  console.log(chalk.bgGreen.black('I\'m Online\nI\'m Online'));
};
