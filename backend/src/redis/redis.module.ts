import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * RedisModule — Provides caching via Redis (production) or in-memory (development).
 * 
 * Configure via environment variables:
 *   REDIS_URL=redis://default:password@host:port   (full connection string)
 * 
 * If REDIS_URL is not set, falls back to in-memory cache (fine for development).
 */
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');

        if (redisUrl) {
          // Dynamic import to avoid crashing if ioredis is not installed
          const { redisStore } = await import('cache-manager-ioredis-yet');
          return {
            store: redisStore,
            url: redisUrl,
            ttl: 300, // Default TTL: 5 minutes (in seconds)
          };
        }

        // Fallback: in-memory cache for development
        return {
          ttl: 300,
        };
      },
      isGlobal: true,
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
