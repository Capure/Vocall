import Discord from 'discord.js';
import { RedisLogic } from '../redisLogic';
import { channelGuard } from '../utils/channelGuard';

export const changeVolumeCommand = async (interaction: Discord.Interaction, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    if (!channelGuard(interaction, connections)) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`
        <@${interaction.author?.id}> you must be in a voice channel with me
        in order to change the volume level!
        `);
        interaction.channel.send(embed);
        return;
    }
    if (interaction.options === null) { return };
    let newVolume = parseInt(interaction.options[0].value);
    if (isNaN(newVolume)) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("In what universe is this a number ?");
        interaction.channel.send(embed);
        return;
    }
    if (newVolume < 0) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("How do you want me to go below 0 ???\nAre you mad ?!");
        interaction.channel.send(embed);
        return;
    }
    if (newVolume > 200) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("You can not set the volume to higher than 200 ...\nThat would be rude to other people in your voice channel!");
        interaction.channel.send(embed);
        return;
    }
    const queue = await db.getQueue(<any>(interaction.guild?.id));
    if (!queue.playing) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`There is no music playing!`);
        interaction.channel.send(embed);
        return;
    }
    queue.volume = newVolume / 100;
    connections.get(<any>(interaction.guild?.id))?.dispatcher.setVolume(newVolume / 100);
    await db.setQueue(<any>(interaction.guild?.id), queue);
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`Changed volume to ${newVolume}%`);
    interaction.channel.send(embed);
}