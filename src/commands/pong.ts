import Discord from 'discord.js';
import os from 'os';

export const sendPongCommand = (interaction: Discord.Interaction) => {
    const serverTime: string = new Date().toISOString();
    const osType: string = os.type();
    const nodeVersion: string = process.version;
    const vocallVersion: string | undefined = process.env.VOCALL_VERSION;
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
    .setTitle('Pong')
    .setColor(0x000000)
    .setDescription(`
    Vocall bot version: \`${vocallVersion}\`
    Node JS version: \`${nodeVersion}\`
    Operating system: \`${osType}\`
    Server time: \`${serverTime}\`
    Database: \`Redis\`
    Language: \`TypeScript\`
    `);
    interaction.channel.send(embed);
};