import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis {
  constructor(private readonly configService: ConfigService) {
    const url = configService.get('redis.url')

    if (!url) {
      throw new Error('missing "redis.url" config')
    }

    super(`${url}/1`, { maxRetriesPerRequest: null })
  }
}
