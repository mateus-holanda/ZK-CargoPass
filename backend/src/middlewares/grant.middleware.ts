import { Injectable, NestMiddleware } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import RedisStore from "connect-redis"
import express from "express"
import session from "express-session"
import Grant from "grant"
import * as redis from "redis"

export const SESSION_KEY_NAME = 'auth.grant'

@Injectable()
export class GrantMiddleware implements NestMiddleware {
  private readonly router = express.Router()
  constructor(private readonly configService: ConfigService) {
    const url = configService.get<string>('REDIS_URL') || configService.get('redis.url')

    const client = redis.createClient({ url: `${url}/0` })
    client.connect().catch((err) => {
      console.error('Redis client error:', err)
    })
    const store = new RedisStore({
      client,
      prefix: 'grant:',
      ttl: configService.get('auth.sessionLength'),
    })
    const grant = Grant.express(this.configService.get('grant'))

    this.router.use([
      session({
        name: SESSION_KEY_NAME,
        store,
        resave: true,
        saveUninitialized: true,
        secret: configService.get('auth.secret'),
        cookie: configService.get('auth.cookie'),
      }),
      grant,
    ])
  }

  public use(req: express.Request, res: express.Response, next: () => void) {
    return this.router(req, res, next)
  }
}
