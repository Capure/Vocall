import Discord from 'discord.js';
import { RedisLogic } from '../redisLogic';
import { channelGuard } from '../utils/channelGuard';

export const repeatCommand = async (interaction: Discord.Interaction, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    if (!channelGuard(interaction, connections)) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`
        <@${interaction.author?.id}> you must be in a voice channel with me in order to put the current song on repeat!
        `);
        interaction.channel.send(embed);
        return;
    }
    const queue = await db.getQueue(<any>(interaction.guild?.id));
    if (queue.current === null) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("You should repeat your education!\nThere is no song to put on repeat!");
        interaction.channel.send(embed);
        return;
    }
    queue.current.repeat = true;
    await db.setQueue(<any>(interaction.guild?.id), queue);
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`<@${interaction.author?.id}> just set the song to repeat!`);
    interaction.channel.send(embed);
}