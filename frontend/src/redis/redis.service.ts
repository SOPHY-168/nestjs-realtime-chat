import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private readonly client: Redis;

    constructor( private readonly config: ConfigService) {
        this.client = new Redis ({
            host: this.config.getOrThrow<string>('REDIS_HOST'),
            port: Number(this.config.getOrThrow<string>('REDIS_PORT')),
            password: this.config.getOrThrow<string>('REDIS_PASSWORD'),
            db: Number(this.config.get('REDIS_DB', 0)),
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            retryStrategy: (times) => Math.min(times * 200, 2000),

        });

        this.client.on('ready', () => {
            this.logger.log('Redis connection ready');
        });

        this.client.on('error', (error: Error) => {
            this.logger.error(error.message);
        });
    }
    async onModuleInit(): Promise<void> {
        await this.client.connect();
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client.status === 'end') return;
        this.client.disconnect();
    }

    getClient(): Redis {
        return this.client;
    }

    async ping(): Promise<string> {
        return this.client.ping();
    }

    async set(
        key: string,
        value: string,
        ttlSeconds?: number,
    ): Promise<void> {
        if ( ttlSeconds !== undefined ) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, value);
        }
    };

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async delete(key: string): Promise<number> {
        return this.client.del(key);
    }

}
