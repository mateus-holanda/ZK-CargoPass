import { Injectable, NestMiddleware } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import RedisStore from "connect-redis"
import cookieParser from "cookie-parser"
import express from "express"
import session from "express-session"
import passport from "passport"
import * as redis from "redis"

export const SESSION_KEY_NAME = 'auth.sessionId'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly router = express.Router()
  constructor(private readonly configService: ConfigService) {
    const url = configService.get<string>('REDIS_URL') || configService.get('redis.url')

    const client = redis.createClient({ url: `${url}/0` })
    client.connect().catch((err) => {
      console.error('Redis client error:', err)
    })
    const store = new RedisStore({
      client,
      prefix: 'session:',
      ttl: configService.get('auth.sessionLength'),
    })

    this.router.use([
      cookieParser(),
      session({
        name: SESSION_KEY_NAME,
        store,
        resave: false,
        saveUninitialized: false,
        secret: configService.get('auth.secret'),
        cookie: configService.get('auth.cookie'),
      }),
      passport.initialize(),
      passport.session(),
    ])
  }

  public use(req: express.Request, res: express.Response, next: () => void) {
    return this.router(req, res, next)
  }
}
