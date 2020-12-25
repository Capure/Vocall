import Discord from 'discord.js';
import { RedisLogic } from '../redisLogic';
import { channelGuard } from '../utils/channelGuard';

export const clearQueueCommand = async (interaction: Discord.Interaction, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    if (!channelGuard(interaction, connections)) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`
        <@${interaction.author?.id}> you must be in a voice channel with me in order to clear the queue!
        `);
        interaction.channel.send(embed);
        return;
    }
    const queue = await db.getQueue(<any>(interaction.guild?.id));
    if (queue.songs === null || queue.songs.length <= 0) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("Your bank account has been cleared!\nThere are no songs in the queue!");
        interaction.channel.send(embed);
        return;
    }
    queue.songs = [];
    await db.setQueue(<any>(interaction.guild?.id), queue);
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`<@${interaction.author?.id}> just cleared the queue!`);
    interaction.channel.send(embed);
}