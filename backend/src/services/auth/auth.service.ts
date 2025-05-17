import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { SessionEntity, SessionRole } from "../../entities/session.entity"
import { UserEntity } from "../../entities/user.entity"
import { PrismaService } from "../../services/prisma/prisma.service"
import { RedisService } from "../../services/redis/redis.service"
import { UserService } from "../../services/user/user.service"
import { encryptSHA256 } from "../../utils/encryption"
import { Scopes, ScopesByRole } from "./permissions"

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async login(email: string, password: string) {
    let user = await this.prismaService.user.findFirst({ where: { email: email.toLowerCase() } })
    user = user ? new UserEntity(user) : null

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const sessionRole = user.role as SessionRole

    const encryptedPassword = encryptSHA256(password, user.salt)
    const scopes = ScopesByRole[sessionRole] ?? []

    if (user.password !== encryptedPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return new SessionEntity({ user, scopes, sessionRole })
  }

  public async retrieveSession(userId: string) {
    const user = await this.userService.getUserById(userId)

    if (!user) {
      console.info(`user ${user?.id ?? 'N/A'} does not exist`)
      throw new UnauthorizedException('User does not exist')
    }

    const sessionRole = user.role as SessionRole

    const scopes = ScopesByRole[sessionRole] ?? []

    return { user, scopes, sessionRole } as SessionEntity
  }

  public async validateToken(token: string): Promise<{ id: string; type: string; marker: number }> {
    const tokenInfo = await this.redisService.get(`token:${token}`)

    if (!tokenInfo) {
      throw new UnauthorizedException('Token is invalid or has expired')
    }

    return JSON.parse(tokenInfo)
  }
}
