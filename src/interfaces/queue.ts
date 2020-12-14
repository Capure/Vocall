import Discord from 'discord.js';
import { song } from './song';

export interface queue {
    playing: boolean,
    current: song | null,
    songs: Array<song>,
    volume: number
}