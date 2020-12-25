import Discord from 'discord.js';
import { RedisLogic } from '../redisLogic';
import { channelGuard } from '../utils/channelGuard';

export const dieCommand = async (interaction: Discord.Interaction, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    if (!channelGuard(interaction, connections)) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`
        <@${interaction.author?.id}> you must be in a voice channel with me in order to kill me!
        `);
        interaction.channel.send(embed);
        return;
    }
    const oldQueue = await db.getQueue(<any>(interaction.guild?.id));
    const connection = connections.get(<any>(interaction.guild?.id));
    if (connection !== undefined) {
        connection.channel.leave();
    }
    await db.setQueue(<any>(interaction.guild?.id), {
        playing: false,
        current: null,
        songs: [],
        volume: oldQueue.volume
    })
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`Successfully commited suicide!`);
    interaction.channel.send(embed);
}