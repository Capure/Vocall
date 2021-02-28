import { repeatCommand } from './commands/repeat';
import { changeVolumeCommand } from './commands/volume';
import { clearQueueCommand } from './commands/clearQueue';
import { skipCommand } from './commands/skip';
import { showQueueCommand } from './commands/showQueue';
import { dieCommand } from './commands/die';
import Discord from 'discord.js';
import path from 'path';
import dotenv from "dotenv";
import { playMusicCommand } from './commands/play';
import { sendPongCommand } from './commands/pong';
import { RedisLogic } from './redisLogic';
import redis from 'redis';
import interactions from "discord-slash-commands-client";
import { depWarning } from './utils/depWarning';
import { searchCommand } from './commands/search';
dotenv.config({ path: path.join(__dirname, "../.env") });
const redisClient = redis.createClient();
const client: Discord.Client & { interactions?: interactions.Client } = new Discord.Client();
client.interactions = new interactions.Client(process.env.TOKEN ? process.env.TOKEN : "", process.env.BOT_ID ? process.env.BOT_ID : "");

redisClient.on('error', err => {
    console.error(err);
});

const db = new RedisLogic(redisClient);
const connections = new Map<string, Discord.VoiceConnection>();

client.user?.setActivity("music", { type: "PLAYING" });

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.interactions?.deleteCommand("792094461164781579");
    client.interactions?.deleteCommand("792093196296912929");
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
    client.interactions?.createCommand({
        name: "search",
        description: "let's you search youtube for songs by their title",
        options: [{
            name: "title",
            description: "name of the song you want to search for.",
            type: 3,
            required: true
        }]
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
            repeatCommand(interaction, db, connections);
            break;
        case "skip":
            skipCommand(interaction, db, connections);
            break;
        case "queue":
            showQueueCommand(interaction, db);
            break;
        case "clear":
            clearQueueCommand(interaction, db, connections);
            break;
        case "volume":
            changeVolumeCommand(interaction, db, connections);
            break;
        case "search":
            searchCommand(interaction, db, connections);
            break;
        case "ping":
            sendPongCommand(interaction);
            break;
        default:
            break;
    }
});

client.on('message', (msg) => {
    if (msg.content.startsWith("$")) {
        depWarning(msg);
    }
})

client.login(process.env.TOKEN);