import { Redis } from 'ioredis';

export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(redisConfig);

redisConnection.on('connect', () => {
  console.log('Connected to Redis');
});

redisConnection.on('error', (error) => {
  console.error('Redis connection error:', error);
});
