import { Module } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { UserService } from "./user.service"

@Module({
  imports: [],
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class UserServiceModule {}
