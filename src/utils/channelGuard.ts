import { onFinish, onFinishCommand } from './../utils/onFinish';
import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import { RedisLogic } from '../redisLogic';

export const channelGuard = (interaction: Discord.Interaction, connections: Map<string, Discord.VoiceConnection>): boolean => {
    if (interaction.author === null) {throw Error("Interaction author was null!")}
    const reqMember = interaction.guild.members.resolve(interaction.author);
    const connection = connections.get(interaction.guild.id);
    if (!connection) {
        return false;
    } else {
        return connection.channel.id === reqMember?.voice.channel?.id;
    }
}