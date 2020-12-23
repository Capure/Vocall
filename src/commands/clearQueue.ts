import Discord from 'discord.js';
import { RedisLogic } from '../redisLogic';


export const clearQueue = async (msg: Discord.Message, db: RedisLogic) => {
    const queue = await db.getQueue(<any>(msg.guild?.id));
    if (queue.songs === null || queue.songs.length <= 0) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("Your bank account has been cleared!\nThere are no songs in the queue!");
        msg.channel.send(embed);
        return;
    }
    queue.songs = [];
    await db.setQueue(<any>(msg.guild?.id), queue);
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("Queue has been cleared!");
    msg.channel.send(embed);
}

export const clearQueueCommand = async (interaction: Discord.Interaction, db: RedisLogic) => {
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