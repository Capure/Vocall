import Discord from 'discord.js';
import { RedisLogic } from '../redisLogic';

export const showQueueCommand = async (interaction: Discord.Interaction, db: RedisLogic) => {
    const queue = await db.getQueue(<any>(interaction.guild?.id));
    let songsStr = "";
    queue.songs.map((song, index) => {
        songsStr += `**${(index + 1)}**. \`${song.title}\`\n`;
    });
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(queue.current?.title ? `**Current song**: \`${queue.current?.title}\`\n${songsStr}` : "There are no songs in the queue!");
    interaction.channel.send(embed);
}