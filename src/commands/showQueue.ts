import Discord = require('discord.js');
import { RedisLogic } from '../redisLogic';


export const showQueue = async (msg: Discord.Message, db: RedisLogic) => {
    const queue = await db.getQueue(<any>(msg.guild?.id));
    let songsStr = "";
    queue.songs.map((song, index) => {
        songsStr += `**${(index + 1)}**. \`${song.title}\`\n`;
    });
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(queue.current?.title ? `**Current song**: \`${queue.current?.title}\`\n${songsStr}` : "There are no songs in the queue!");
    msg.channel.send(embed);
}