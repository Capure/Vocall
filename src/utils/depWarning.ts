import Discord from 'discord.js';

export const depWarning = async (msg: Discord.Message) => {
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`
        ***WARNING***: You are using a legacy command that is deprecated!
        > Please use slash commands instead!
        `);
    msg.channel.send(embed);
}