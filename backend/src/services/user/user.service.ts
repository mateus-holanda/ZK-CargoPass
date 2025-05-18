import { Injectable } from "@nestjs/common"
import { SignUpDto } from "../../dtos/user/sign-up.dto"
import { UserEntity } from "../../entities/user.entity"
import { PrismaService } from "../../services/prisma/prisma.service"
import { encryptMD5, encryptSHA256 } from "../../utils/encryption"

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async signUp(data: SignUpDto) {
    let user = await this.getUserByEmail(data.email)
    const { password, salt } = this.encryptPassword(data.password)
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          password,
          salt,
        },
      })
    }

    return user ? new UserEntity(user) : null
  }

  public async getUserById(userId: string) {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    return user ? new UserEntity(user) : null
  }

  public async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({ where: { email: email.toLowerCase() } })
    return user ? new UserEntity(user) : null
  }

  private encryptPassword(rawPassword: string) {
    const salt = encryptMD5(`salt-${Math.random()}-${Date.now()}`)
    const password = encryptSHA256(rawPassword, salt)
    return { salt, password }
  }
}
