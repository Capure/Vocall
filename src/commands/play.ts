import { onFinish } from './../utils/onFinish';
import { song } from './../interfaces/song';
import { RedisLogic } from './../redisLogic';
import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import yts from 'yt-search';

export const playMusic = async (msg: Discord.Message, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    const rawMsg: Array<string> = msg.content.split(' ');
    const channel = msg.member?.voice.channel;
    rawMsg.shift();
    let url: string = rawMsg.join(' ');
    if (!url.startsWith('http://') || !url.startsWith('https://')) {
        const r = await yts(url);
        url = r.videos[0].url;
    }
    if (channel === null || !channel) {
        msg.channel.send("You must be in a voice channel!");
        return;
    } else {
        if (msg.client.user === null || !msg.guild?.id) {
            msg.channel.send(
            "Oopsie daisy! I just got a stroke!"
            );
            return;
        }
        const permissions = channel.permissionsFor(msg.client.user);
        if (!permissions?.has("CONNECT") || !permissions.has("SPEAK")) {
            msg.channel.send(
            "I need the permissions to join and speak in your voice channel!"
            );
            return;
        }
        const songInfo = await ytdl.getInfo(url);
        const song: song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            requestedAt: Math.floor(new Date().getTime() / 1000),
            requestedById: msg.author.id
        };
        const currentQueue = await db.getQueue(msg.guild?.id);
        if (!currentQueue.playing) {
            const connection = await channel.join();
            await db.setQueue(msg.guild?.id, {
                playing: true,
                current: song,
                songs: [],
                volume: currentQueue.volume
            });
            connections.set(msg.guild?.id, connection);
            connection.play(ytdl(song.url, { filter: 'audioonly' }), { volume: currentQueue.volume }).on('finish', () => { onFinish(msg, db, connections) }).on("error", async (err) => {
                console.error(err);
                msg.channel.send("Oopsie daisy! I just got a stroke!");
                await db.setQueue(<any>(msg.guild?.id), {
                    playing: false,
                    current: null,
                    songs: [],
                    volume: currentQueue.volume
                });
            });
            const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
                .setColor(0x000000)
                .setDescription(`Playing: \`${song.title}\`\n Requested by <@${msg.author.id}>`);
            msg.channel.send(embed);
        } else {
            const oldQueue = await db.getQueue(<any>(msg.guild?.id));
            oldQueue.songs.push(song);
            await db.setQueue(<any>(msg.guild?.id), oldQueue);
            const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
                .setColor(0x000000)
                .setDescription(`Added \`${song.title}\` to the queue!`);
            msg.channel.send(embed);
        }
    }
};