import { Body, Controller, HttpStatus, Post } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Request } from "express"
import session from "express-session"
import { LoginCredentialsDto } from "../../dtos/auth/login-credentials.dto"
import { SessionEntity } from "../../entities/session.entity"
import { AuthService } from "../../services/auth/auth.service"
import { AuthLogin } from "../../services/auth/decorators/auth-login.decorator"
import { AuthLogout } from "../../services/auth/decorators/auth-logout.decorator"
import { AuthSession } from "../../services/auth/decorators/auth-session.decorator"

export interface RequestWithSession extends Request {
  session: session.Session & { passport: { user: Record<string, unknown> } }
}

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Email + Password authentication */
  @Post('login')
  @ApiOperation({ summary: 'User authentication using email + password' })
  @ApiOkResponse({ type: SessionEntity })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @AuthLogin()
  public async login(@Body() data: LoginCredentialsDto, @AuthSession() session: SessionEntity) {
    return session
  }

  /** Logout */
  @Post('logout')
  @AuthLogout()
  @ApiOperation({ summary: 'Revokes the current session' })
  @ApiResponse({ status: HttpStatus.OK })
  public logout() {
    return true
  }
}
