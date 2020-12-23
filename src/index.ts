import { repeat, repeatCommand } from './commands/repeat';
import { help } from './commands/help';
import { changeVolume, changeVolumeCommand } from './commands/volume';
import { clearQueue, clearQueueCommand } from './commands/clearQueue';
import { skip, skipCommand } from './commands/skip';
import { showQueue, showQueueCommand } from './commands/showQueue';
import { die, dieCommand } from './commands/die';
import Discord from 'discord.js';
import path from 'path';
import dotenv from "dotenv";
import { playMusic, playMusicCommand } from './commands/play';
import { sendPong, sendPongCommand } from './commands/pong';
import { RedisLogic } from './redisLogic';
import redis from 'redis';
import interactions from "discord-slash-commands-client";
import { depWarning } from './utils/depWarning';
dotenv.config({ path: path.join(__dirname, "../.env") });
const redisClient = redis.createClient();
const client: Discord.Client & { interactions?: interactions.Client } = new Discord.Client();
client.interactions = new interactions.Client(process.env.TOKEN ? process.env.TOKEN : "", process.env.BOT_ID ? process.env.BOT_ID : "");
const prefix: string = "$";

redisClient.on('error', err => {
    console.error(err);
});

const db = new RedisLogic(redisClient);
const connections = new Map<string, Discord.VoiceConnection>();

client.user?.setActivity("music", { type: "PLAYING" });

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.interactions?.createCommand({
        name: "play",
        description: "let's you play music",
        options: [{
            name: "song",
            description: "Name or youtube url of the song you want to play.",
            type: 3,
            required: true
        }]
    })
    .catch(console.error);
    client.interactions?.createCommand({
      name: "die",
      description: "kills the bot"
    })
    .catch(console.error);
    client.interactions?.createCommand({
        name: "repeat",
        description: "let's you put the current song on repeat"
    })
    .catch(console.error);
    client.interactions?.createCommand({
        name: "skip",
        description: "let's you skip to another song"
    })
    .catch(console.error);
    client.interactions?.createCommand({
        name: "queue",
        description: "let's you see all then songs in the queue"
    })
    .catch(console.error);
    client.interactions?.createCommand({
        name: "clear",
        description: "let's you clear the queue"
    })
    .catch(console.error);
    client.interactions?.createCommand({
        name: "volume",
        description: "let's you change the volume",
        options: [{
            name: "level",
            description: "New volume level.",
            type: 4,
            required: true
        }]
    })
    .catch(console.error);
    client.interactions?.createCommand({
        name: "ping",
        description: "let's you check if the bot is still alive"
    })
    .catch(console.error);
});

client.on("interactionCreate", (interaction) => {
    if (interaction.name === "ping") {
      interaction.channel.send("pong");
    }
    switch (interaction.name) {
        case "play":
            playMusicCommand(interaction, db, connections);
            break;
        case "die":
            dieCommand(interaction, db, connections);
            break;
        case "repeat":
            repeatCommand(interaction, db);
            break;
        case "skip":
            skipCommand(interaction, db, connections);
            break;
        case "queue":
            showQueueCommand(interaction, db);
            break;
        case "clear":
            clearQueueCommand(interaction, db);
            break;
        case "volume":
            changeVolumeCommand(interaction, db, connections);
            break;
        case "ping":
            sendPongCommand(interaction);
            break;
        default:
            break;
    }
});

// !WARNING! - This part and all of it's dependencies will be removed in the next release of Vocall
// This is a breaking change
// That's why I've changed the version number to 2.0.0
// To make this transition smooth Vocall will display a warning for some time
// And in the future I will purge the "legacy" commands from the source code
//
// Capure

client.on('message', msg => {
    switch (msg.content.split(' ')[0]) {
        case `${prefix}help`:
            help(msg);
            depWarning(msg);
            break;
        case `${prefix}play`:
            playMusic(msg, db, connections);
            depWarning(msg);
            break;
        case `${prefix}p`:
            playMusic(msg, db, connections);
            depWarning(msg);
            break;
        case `${prefix}repeat`:
            repeat(msg, db);
            depWarning(msg);
            break;
        case `${prefix}die`:
            die(msg, db, connections);
            depWarning(msg);
            break;
        case `${prefix}queue`:
            showQueue(msg, db);
            depWarning(msg);
            break;
        case `${prefix}skip`:
            skip(msg, db, connections);
            depWarning(msg);
            break;
        case `${prefix}clear`:
            clearQueue(msg, db);
            depWarning(msg);
            break;
        case `${prefix}volume`:
            changeVolume(msg, db, connections);
            depWarning(msg);
            break;
        case `${prefix}ping`:
            sendPong(msg);
            depWarning(msg);
            break;
        default:
            break;
    }
});
client.login(process.env.TOKEN);