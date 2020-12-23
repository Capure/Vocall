import Discord from 'discord.js';
import { RedisLogic } from '../redisLogic';


export const repeat = async (msg: Discord.Message, db: RedisLogic) => {
    const queue = await db.getQueue(<any>(msg.guild?.id));
    if (queue.current === null) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("You should repeat your education!\nThere is no song to put on repeat!");
        msg.channel.send(embed);
        return;
    }
    queue.current.repeat = true;
    await db.setQueue(<any>(msg.guild?.id), queue);
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("The song was set to repeat!");
    msg.channel.send(embed);
}

export const repeatCommand = async (interaction: Discord.Interaction, db: RedisLogic) => {
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