import { Module } from '@nestjs/common'

import { AuthServiceModule } from '../../services/auth/auth-service.module'
import { PrismaService } from '../../services/prisma/prisma.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [AuthServiceModule],
  providers: [PrismaService, AuthController],
  controllers: [AuthController],
})
export class AuthControllerModule {}
