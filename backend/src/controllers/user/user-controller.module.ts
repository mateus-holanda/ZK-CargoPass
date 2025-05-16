import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "../../services/prisma/prisma.service"
import { UserServiceModule } from "../../services/user/user-service.module"
import { UserController } from "./user.controller"

@Module({
  imports: [UserServiceModule],
  providers: [UserController, ConfigService, JwtService, PrismaService],
  controllers: [UserController],
})
export class UserControllerModule {}
