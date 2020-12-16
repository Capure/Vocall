import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import { RedisLogic } from '../redisLogic';

export const onFinish = async (msg: Discord.Message, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    const connection = connections.get(<any>(msg.guild?.id));
    const newQueue = await db.getQueue(<any>(msg.guild?.id));
    if (newQueue.current?.repeat) {
        connection?.play(ytdl(newQueue.current.url, { filter: 'audioonly' }), { volume: newQueue.volume }).on("finish", () => {
            onFinish(msg, db, connections);
        }).on("error", async (err) => {
                console.error(err);
                msg.channel.send("Oopsie daisy! I just got a stroke!");
                await db.setQueue(<any>(msg.guild?.id), {
                    playing: false,
                    current: null,
                    songs: [],
                    volume: newQueue.volume
                });
            });
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setColor(0x000000)
            .setDescription(`Repeating: \`${newQueue.current.title}\`\nOriginally requested by <@${newQueue.current.requestedById}>`);
        msg.channel.send(embed);
        return;
    }
    if (newQueue.songs.length > 0) {
        const nextSong = newQueue.songs.shift();
        if (!nextSong) {
            console.error("Song was undefined!");
            return;
        }
        connection?.play(ytdl(nextSong.url, { filter: 'audioonly' }), { volume: newQueue.volume }).on("finish", () => {
            onFinish(msg, db, connections);
        }).on("error", async (err) => {
                console.error(err);
                msg.channel.send("Oopsie daisy! I just got a stroke!");
                await db.setQueue(<any>(msg.guild?.id), {
                    playing: false,
                    current: null,
                    songs: [],
                    volume: newQueue.volume
                });
            });
        await db.setQueue(<any>(msg.guild?.id), {
            playing: true,
            current: nextSong,
            songs: newQueue.songs,
            volume: newQueue.volume
        });
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setColor(0x000000)
            .setDescription(`Playing: \`${nextSong.title}\`\n Requested by <@${nextSong.requestedById}>`);
        msg.channel.send(embed);
        return;
    }
    connections.delete(<any>(msg.guild?.id));
    await db.setQueue(<any>(msg.guild?.id), {
        playing: false,
        current: null,
        songs: [],
        volume: newQueue.volume
    });
    connection?.channel.leave();
}