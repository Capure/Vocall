import Discord from 'discord.js';
import yts from 'yt-search';
import { RedisLogic } from '../redisLogic';
import { channelGuard } from '../utils/channelGuard';
import { playMusicCore } from './play';

export const searchCommand = async (interaction: Discord.Interaction, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    if (interaction.author === null) { return }
    if (interaction.options === null) { return }
    const msgchannel = interaction.channel;
    const channel = interaction.guild.members.resolve(interaction.author)?.voice.channel;
    if (!channel) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`
        <@${interaction.author?.id}> in order to play a song or add it to the queue
        you must be connected to a voice channel!
        `);
        interaction.channel.send(embed);
        return;
    }
    let rawUrl: string = interaction.options[0].value;
    let url = "";
    const r = await yts(rawUrl);
    const videos = r.videos.slice(0, 4);
    const videoTitles = videos.map(video => video.title);
    const time = 60000;
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
    .setColor(0xff0000)
        .setDescription("1. " + videoTitles.reduce((prev, title, idx) => {
            return `${prev}\n${idx+1}. ${title}`;
        }));
    msgchannel.send(embed)
    .then(async function (message) {
        if (videoTitles.length > 0) {
            await message.react('1️⃣');
        }
        if (videoTitles.length > 1) {
            await message.react('2️⃣');
        }
        if (videoTitles.length > 2) {
            await message.react('3️⃣');
        }
        if (videoTitles.length > 3) {
            await message.react('4️⃣');
        }
        if (videoTitles.length > 4) {
            await message.react('5️⃣');
        }

        const filter = (reaction: Discord.MessageReaction, user: Discord.User) => {
            const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
            return reactions.filter(emoji => emoji === reaction.emoji.name).length > 0;
        };
        const collector = message.createReactionCollector(filter, { time: time }); 
        collector.on('collect', (reaction, reactionCollector) => {
            if (reactionCollector.bot) {
                return;
            }
            switch (reaction.emoji.name) {
                case '1️⃣':
                    url = videos[0].url;
                    break;
                case '️2️⃣':
                    url = videos[1].url;
                    break;
                case '3️⃣':
                    url = videos[2].url;
                    break;
                case '4️⃣':
                    url = videos[3].url;
                    break;
                case '5️⃣':
                    url = videos[4].url;
                    break;
                default:
                    break;
            }
            message.delete();
            playMusicCore(interaction, db, connections, channel, url);
        });
    });
};;