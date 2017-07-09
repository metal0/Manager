const util = require('util');
exports.run = async (client, message, args = []) => {
  let suffix = args.join(' ');
  try {
    let evaled = await eval(suffix);
    let type = typeof evaled;
    let insp = util.inspect(evaled, {depth: 1});
    let tosend = [];

    if (evaled === null) evaled = 'null';

    tosend.push('**EVAL:**');
    tosend.push('\`\`\`js');
    tosend.push(clean(suffix));
    tosend.push('\`\`\`');
    tosend.push('**Evaluates to:**');
    tosend.push('\`\`\`LDIF');
    tosend.push(clean(evaled.toString().replace(client.token, 'Redacted').replace(client.user.email, 'Redacted')));
    tosend.push('\`\`\`');
    if (evaled instanceof Object) {
      tosend.push('**Inspect:**');
      tosend.push('\`\`\`js');
      tosend.push(insp.toString().replace(client.token, 'Redacted').replace(client.user.email, 'Redacted'));
      tosend.push('\`\`\`');
    } else {
      tosend.push('**Type:**');
      tosend.push('\`\`\`js');
      tosend.push(type);
      tosend.push('\`\`\`');
    }
    await message.channel.send(tosend, {split: true});
  } catch (err) {
    let tosend = [];
    tosend.push('**EVAL:** \`\`\`js');
    tosend.push(clean(suffix));
    tosend.push('\`\`\`');
    tosend.push('**Error:** \`\`\`LDIF');
    tosend.push(clean(err.message));
    tosend.push('\`\`\`');
    await message.channel.send(tosend, {split: true});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ev'],
  permLevel: 10
};

exports.help = {
  name: 'eval',
  description: 'Evaluates arbitrary Javascript.',
  usage: 'eval <expression>',
  category:'System',
  subCategory:'Owner'
};

function clean(text) {
  if (typeof(text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  } else {
    return text;
  }
}
