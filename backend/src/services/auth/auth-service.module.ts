import { forwardRef, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { PassportModule } from '@nestjs/passport'

import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
import { UserServiceModule } from '../user/user-service.module'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { AuthGuard } from './guards/auth.guard'
import { SessionSerializer } from './session.serializer'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [
    PassportModule.register({ session: true }),
    forwardRef(() => UserServiceModule),
  ],
  providers: [
    AuthService,
    ConfigService,
    LocalStrategy,
    PrismaService,
    RedisService,
    SessionSerializer,
    UserService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [AuthService],
})
export class AuthServiceModule {}
