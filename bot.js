import discord
from discord.ext import commands
from ext.context import CustomContext
from ext.formatter import EmbedHelp
from collections import defaultdict
from ext import embedtobox
import asyncio
import aiohttp
import datetime
import psutil
import time
import json
import sys
import os
import re
import textwrap
from PIL import Image
import io

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
client.on("ready", () => {
  client.user.setActivity(`Serving LOST`);
});

class Lostfbot():

  client.on("message", async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "test") {
      const sayMessage = args.join(" ");
      message.channel.send('```\n' +
                           "I'm still here!\n" + 
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
      if(!message.member.roles.some(r=>["DJ"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!",).then(msg => {msg.delete(10000)});
      const sayMessage = args.join(" ");
      message.delete().catch(O_o=>{}); 
      message.channel.send(sayMessage);
    }

    if(command === "kick") {
      const modFeedChannel = "447070425869189120";
      const bannedBy = message.author;

      message.delete().catch(O_o=>{}); 
      if(!message.member.roles.some(r=>["Admin", "Mod"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!",).then(msg => {msg.delete(10000)}) ;
      let member = message.mentions.members.first() || message.guild.members.get(args[0]);
      if(!member)
        return message.reply("Please mention a valid member of this server").then(msg => {msg.delete(10000)}) ;
      if(!member.kickable) 
        return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?").then(msg => {msg.delete(10000)}) ;

      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";

      await member.kick(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
      client.channels.get(modFeedChannel).send(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
      //message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

    }

    if(command === "ban") {
      const modFeedChannel = "447070425869189120";
      const bannedBy = message.author;

      if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!",).then(msg => {msg.delete(10000)});

      let member = message.mentions.members.first();
      if(!member)
        return message.reply("Please mention a valid member of this server").then(msg => {msg.delete(10000)}) ;
      if(!member.bannable) 
        return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?").then(msg => {msg.delete(10000)}) ;

      let reason = args.slice(1).join(' ');
      if(!reason) reason = "No reason provided";

      await member.ban(reason)
        .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
      client.channels.get(modFeedChannel).send(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
      //message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    }

    if(command === "purge") {
      if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!",).then(msg => {msg.delete(10000)});

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

    if(command === "help") {
      if(message.channel.id === '439927143854637067') {
        const sayMessage = args.join(" ");
        const helpMessage = sayMessage.replace(/\`/g, '*');
        const helpChannel = '439927823356919818';
        const helpSender = message.author;
        message.delete().catch(O_o=>{}); 
        client.channels.get(helpChannel).send(helpSender + ' Sent:' + "```" + helpMessage + "```");
      } else message.delete().catch(O_o=>{}); 
        return message.reply("Sorry, your not in the right channel!",).then(msg => {msg.delete(10000)})  
    }

    if(command === "report") {
      //if(message.author.id = '207779007331041280')
      //  message.delete().catch(O_o=>{}); 
      //  return message.reply("Sorry, you don't have permissions to use this!");
      if(message.channel.id === '439927083041423361') {
        const sayMessage = args.join(" ");
        const reMessage = sayMessage.replace(/\`/g, '*');
        const reportChannel = '439927781175066624';
        const reportSender = message.author;
        message.delete().catch(O_o=>{}); 
        client.channels.get(reportChannel).send(reportSender + ' Sent:' + "```" + reMessage + "```");
      } else message.delete().catch(O_o=>{}); 
        return message.reply("Sorry, your not in the right channel!",).then(msg => {msg.delete(10000)})
    }

  //  if(command ="Monty") {
  //    var bStatues = args.join(" ");
  //    if(!message.member.roles.some(r=>["Perm"].includes(r.name)) ) {
  //      return message.reply("Sorry, you don't have permissions to use this!");
  //    }
  //    let reason = args.slice(1).join(' ');
  //    if(!reason) {
  //      return message.reply("No action was specified");
  //    }
  //
  //    
  //  }
  });

  //client.on("message", (message) => { 
  //  const mAuthor = '207779007331041280';
  //  console.log(message.author)
  //  console.log(message.author.mention)
  //  if(message.author.bot) return;
  //  if(message.author.id == mAuthor) {
  //
  //    message.delete().catch(O_o=>{}); 
  //    //message.channel.send(message.author + ' tried talking!',).then(msg => {msg.delete(10000)})  
  //  }
  //});


  //client.on("message", (message) => { 
  //  const mAuthor = '207779007331041280';
  //  console.log(message.author)
  //  console.log(message.author.mention)
  //  if(message.author.bot) return;
  //  if(message.author.id == mAuthor) {
  //
  //    message.delete().catch(O_o=>{}); 
  //    message.channel.send(message.author + ' tried talking!',).then(msg => {msg.delete(10000)})  }
  //});

  //client.on("message", async message => { 
  //  const mAuthor = '@LOST#9969';
  //  if(message.author.bot) return;
  //  if(message.author.mention === mAuthor);
  //
  //    message.delete().catch(O_o=>{}); 
  //    message.channel.send(message.author + ' tried talking!');
  //});

if __name__ == '__main__':
    Selfbot.init()
