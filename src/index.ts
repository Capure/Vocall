import { repeat } from './commands/repeat';
import { help } from './commands/help';
import { changeVolume } from './commands/volume';
import { clearQueue } from './commands/clearQueue';
import { skip } from './commands/skip';
import { showQueue } from './commands/showQueue';
import { die } from './commands/die';
import Discord from 'discord.js';
import path from 'path';
import dotenv from "dotenv";
import { playMusic } from './commands/play';
import { sendPong } from './commands/pong';
import { RedisLogic } from './redisLogic';
import redis from 'redis';
dotenv.config({ path: path.join(__dirname, "../.env") });
const redisClient = redis.createClient();
const client: Discord.Client = new Discord.Client();
const prefix: string = "$";

redisClient.on('error', err => {
    console.error(err);
});

const db = new RedisLogic(redisClient);
const connections = new Map<string, Discord.VoiceConnection>();

client.user?.setActivity("music", { type: "PLAYING" });

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', msg => {
    switch (msg.content.split(' ')[0]) {
        case `${prefix}help`:
            help(msg);
            break;
        case `${prefix}play`:
            playMusic(msg, db, connections);
            break;
        case `${prefix}p`:
            playMusic(msg, db, connections);
            break;
        case `${prefix}repeat`:
            repeat(msg, db);
            break;
        case `${prefix}die`:
            die(msg, db, connections);
            break;
        case `${prefix}queue`:
            showQueue(msg, db);
            break;
        case `${prefix}skip`:
            skip(msg, db, connections);
            break;
        case `${prefix}clear`:
            clearQueue(msg, db);
            break;
        case `${prefix}volume`:
            changeVolume(msg, db, connections);
            break;
        case `${prefix}ping`:
            sendPong(msg);
            break;
        default:
            break;
    }
});
client.login(process.env.TOKEN);