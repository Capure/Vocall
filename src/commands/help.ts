import Discord = require('discord.js');

export const help = async (msg: Discord.Message) => {
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setTitle('Vocall Help')
        .setColor(0x000000)
        .setDescription(`
        \`play\` - let's you play music
        \`skip\` - let's you skip to another song
        \`queue\` - let's you see all then songs in the queue
        \`clear\` - let's you clear the queue
        \`volume\` - let's you change the volume
        \`ping\` - let's you check if the bot is still alive
        \`die\` - kills the bot 
        `);
    msg.channel.send(embed);
}