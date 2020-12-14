import Discord from 'discord.js';
import { RedisLogic } from '../redisLogic';

export const die = async (msg: Discord.Message, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    const oldQueue = await db.getQueue(<any>(msg.guild?.id));
    const connection = connections.get(<any>(msg.guild?.id));
    if (connection !== undefined) {
        connection.channel.leave();
    }
    await db.setQueue(<any>(msg.guild?.id), {
        playing: false,
        current: null,
        songs: [],
        volume: oldQueue.volume
    })
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`Successfully commited suicide!`);
    msg.channel.send(embed);
}