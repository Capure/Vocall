import { queue } from './interfaces/queue';
import redis from "redis";

export class RedisLogic {
    private client;
    constructor(client: redis.RedisClient) {
        this.client = client;
    }
    private redisGet = (key: string) => new Promise<any>((resolve, reject) => {
        this.client.get(key, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
    private redisSet = (key: string, value: string) => new Promise((resolve, reject) => {
        this.client.set(key, value, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
    async getQueue(id: string): Promise<queue> {
        const result = await this.redisGet(id);
        if (result === null) {
            await this.setQueue(id, {
                playing: false,
                current: null,
                songs: [],
                volume: 1
            })
            return JSON.parse(await this.redisGet(id));
        } else {
            return JSON.parse(result);
        }
    }
    async setQueue(id: string, currentQueue: queue) {
        return await this.redisSet(id, JSON.stringify(currentQueue));
    }
}