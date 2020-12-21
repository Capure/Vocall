import { onFinish, onFinishCommand } from './../utils/onFinish';
import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import { RedisLogic } from '../redisLogic';


export const skip = async (msg: Discord.Message, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    const queue = await db.getQueue(<any>(msg.guild?.id));
    if (!queue.playing || queue.songs === null || queue.songs.length <= 0) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("You skipped your education!\nThere are no songs in the queue!");
        msg.channel.send(embed);
        return;
    }
    const nextSong = queue.songs.shift();
    const connection = connections.get(<any>(msg.guild?.id));
    connection?.dispatcher.pause(true);
    connection?.play(ytdl(<any>(nextSong?.url), { filter: 'audioonly' }), { volume: queue.volume }).on("finish", () => {
        onFinish(msg, db, connections);
    }).on("error", async (err) => {
        console.error(err);
        msg.channel.send("Oopsie daisy! I just got a stroke!");
        await db.setQueue(<any>(msg.guild?.id), {
            playing: false,
            current: null,
            songs: [],
            volume: queue.volume
        });
    });
    queue.current = <any>(nextSong);
    await db.setQueue(<any>(msg.guild?.id), queue);

    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`<@${msg.author.id}> just skipped the song!`);
    msg.channel.send(embed);
}

export const skipCommand = async (interaction: Discord.Interaction, db: RedisLogic, connections: Map<string, Discord.VoiceConnection>) => {
    const queue = await db.getQueue(<any>(interaction.guild?.id));
    if (!queue.playing || queue.songs === null || queue.songs.length <= 0) {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription("You skipped your education!\nThere are no songs in the queue!");
        interaction.channel.send(embed);
        return;
    }
    const nextSong = queue.songs.shift();
    const connection = connections.get(<any>(interaction.guild?.id));
    connection?.dispatcher.pause(true);
    connection?.play(ytdl(<any>(nextSong?.url), { filter: 'audioonly' }), { volume: queue.volume }).on("finish", () => {
        onFinishCommand(interaction, db, connections);
    }).on("error", async (err) => {
        console.error(err);
        interaction.channel.send("Oopsie daisy! I just got a stroke!");
        await db.setQueue(<any>(interaction.guild?.id), {
            playing: false,
            current: null,
            songs: [],
            volume: queue.volume
        });
    });
    queue.current = <any>(nextSong);
    await db.setQueue(<any>(interaction.guild?.id), queue);

    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setColor(0x000000)
        .setDescription(`<@${interaction.author?.id}> just skipped the song!`);
    interaction.channel.send(embed);
}