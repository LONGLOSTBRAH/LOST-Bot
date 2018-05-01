const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
client.on("ready", () => {
  client.user.setActivity(`Serving LOST`);
});


client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  //if(message.author = mAuthor) {
  //  //message.delete().catch(O_o=>{}); 
  //  message.channels.send('Monty tried to type');
  //}

  
  if(command === "test") {
    const sayMessage = args.join(" ");
    message.channel.send('```\n' +
                         "I'm still here! TEST\n" + 
                         '```');
  }
  
  if(command === "commands") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send('```css\n' + 
                         'Bot Commands:\n' + 
                         '/commands : Shows all bot comamnds!\n' +
                         '/test     : Checks if bots online!\n' +
                         '/ping     : Check your ping!\n' +
                         '/say      : Makes the bot talk!\n' +
                         '/kick     : Kicks a user!\n' +
                         '/ban      : Bans a user!\n' +
                         '/purge    : Removes messages!\n' +
                         '/help     : Sends help msg to staff\n' +
                         '/report   : Sends a report to staff\n' +
                         '```');
  }
  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["Admin", "Mod"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {

    if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {

    const deleteCount = '999999';
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 999999)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    message.channel.send('```\n' +
                         "Channel was purged!" + 
                         '```');
    message.channel.send('```ini\n' + 
                         '# LOST Bot Commands:\n' + 
                         '[/commands]; Shows all bot comamnds!\n' +
                         '    [/test]; Checks if bots online!\n' +
                         '    [/ping]; Check your ping!\n' +
                         '     [/say]; Makes the bot talk!\n' +
                         '    [/kick]; Kicks a user!\n' +
                         '     [/ban]; Bans a user!\n' +
                         '   [/purge]; Removes messages!\n' +
                         '    [/help]; Sends help msg to staff\n' +
                         '  [/report]; Sends a report to staff\n' +
                         '```');
  }

});


  client.on("message", async message => { 
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "help") {
    const sayMessage = args.join(" ");
    const helpMessage = sayMessage.replace(/\`/g, '*');
    const helpChannel = '439927823356919818';
    const helpSender = message.author;
    message.delete().catch(O_o=>{}); 
    client.channels.get(helpChannel).send(helpSender + ' Sent:' + "```" + helpMessage + "```");
  }
});



  client.on("message", async message => { 
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "report") {
    const sayMessage = args.join(" ");
    const reMessage = sayMessage.replace(/\`/g, '*');
    const reportChannel = '439927781175066624';
    const reportSender = message.author;
    message.delete().catch(O_o=>{}); 
    client.channels.get(reportChannel).send(reportSender + ' Sent:' + "```" + reMessage + "```");
  }
});

client.login('process.env.BOT_TOKEN');
