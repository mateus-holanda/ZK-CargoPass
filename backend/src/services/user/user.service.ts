import { Injectable } from "@nestjs/common"
import { SignUpDto } from "../../dtos/user/sign-up.dto"
import { UserEntity } from "../../entities/user.entity"
import { PrismaService } from "../../services/prisma/prisma.service"
import { encryptSHA256 } from "../../utils/encryption"

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async signUp(data: SignUpDto) {
    // Get user by email
    let user = await this.getUserByEmail(data.email)

    // Converts a raw password to an encrypted one and insert it in the database
    const password = this.encryptPassword(data.password)

    // If user doesn't exist, create the new user
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          password,
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
    return encryptSHA256(rawPassword)
  }
}
