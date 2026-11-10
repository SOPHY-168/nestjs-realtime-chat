import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RedisService } from '../redis/redis.service.js';
import { timestamp } from 'rxjs';

@Controller('health')
export class HealthController {
    constructor (
        private readonly dataSource: DataSource,
        private readonly redisService: RedisService
    ) {}

    @Get() 
    async check() {
        const services = {
            database: 'down',
            redis: 'down',
        };

        try {
            await this.dataSource.query('SELECT 1');
            services.database = 'up';
        } catch {
            // Database unavailable 
        }

        try {
            const pong = await this.redisService.ping();
            if (pong === 'PONG') {
                services.redis = 'up';
            }
        } catch {
            // Redis unavailable 
        }

        const healthy = 
            services.database === 'up' && 
            services.redis === 'up';

        const result = {
            status: healthy ? 'ok' : 'error',
            services,
            timestamp: new Date().toISOString(),
        };

        if (!healthy) {
            throw new ServiceUnavailableException(result);
        }

        return result;

    }
}
