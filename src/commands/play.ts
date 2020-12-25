import { onFinish, onFinishCommand } from './../utils/onFinish';
import { song } from './../interfaces/song';
import { RedisLogic } from './../redisLogic';
import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import yts from 'yt-search';

export const playMusicCommand = async (interaction: Discord.Interaction, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    if (interaction.author === null) { return }
    if (interaction.options === null) { return }
    const msgchannel = interaction.channel;
    const channel = interaction.guild.members.resolve(interaction.author)?.voice.channel;
    let url: string = interaction.options[0].value;
    if (!url.startsWith('http://') || !url.startsWith('https://')) {
        const r = await yts(url);
        url = r.videos[0].url;
    }
    if (channel === null || !channel) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`
        <@${interaction.author?.id}> in order to play a song or add it to the queue
        you must be connected to a voice channel!
        `);
        interaction.channel.send(embed);
        return;
    } else {
        const songInfo = await ytdl.getInfo(url);
        const song: song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            requestedAt: Math.floor(new Date().getTime() / 1000),
            requestedById: interaction.author.id,
            repeat: false
        };
        const currentQueue = await db.getQueue(interaction.guild?.id);
        if (!currentQueue.playing) {
            const connection = await channel.join();
            await db.setQueue(interaction.guild?.id, {
                playing: true,
                current: song,
                songs: [],
                volume: currentQueue.volume
            });
            connections.set(interaction.guild?.id, connection);
            connection.play(ytdl(song.url, { filter: 'audioonly' }), { volume: currentQueue.volume }).on('finish', () => { onFinishCommand(interaction, db, connections) }).on("error", async (err) => {
                console.error(err);
                msgchannel.send("Oopsie daisy! I just got a stroke!");
                await db.setQueue(<any>(interaction.guild?.id), {
                    playing: false,
                    current: null,
                    songs: [],
                    volume: currentQueue.volume
                });
            });
            const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
                .setColor(0x000000)
                .setDescription(`Playing: \`${song.title}\`\n Requested by <@${interaction.author.id}>`);
            msgchannel.send(embed);
        } else {
            const oldQueue = await db.getQueue(<any>(interaction.guild?.id));
            oldQueue.songs.push(song);
            await db.setQueue(<any>(interaction.guild?.id), oldQueue);
            const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
                .setColor(0x000000)
                .setDescription(`<@${interaction.author.id}> added \`${song.title}\` to the queue!`);
            msgchannel.send(embed);
        }
    }
};