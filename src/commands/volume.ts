import Discord = require('discord.js');
import { RedisLogic } from '../redisLogic';


export const changeVolume = async (msg: Discord.Message, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    let msgRaw = msg.content.split(' ');
    msgRaw.shift();
    let msgJoined = msgRaw.join('');
    let newVolume = parseInt(msgJoined);
    if (isNaN(newVolume)) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("In what universe is this a number ?");
        msg.channel.send(embed);
        return;
    }
    const queue = await db.getQueue(<any>(msg.guild?.id));
    if (!queue.playing) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`There is no music playing!`);
        msg.channel.send(embed);
        return;
    }
    queue.volume = newVolume / 100;
    connections.get(<any>(msg.guild?.id))?.dispatcher.setVolume(newVolume / 100);
    await db.setQueue(<any>(msg.guild?.id), queue);
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`Changed volume to ${newVolume}%`);
    msg.channel.send(embed);
}