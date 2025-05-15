import { Body, Controller, HttpStatus, Post } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { SignUpDto } from "../../dtos/user/sign-up.dto"
import { UserEntity } from "../../entities/user.entity"
import { Public } from "../../services/auth/decorators/public.decorator"
import { UserService } from "../../services/user/user.service"

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Creates a new user, then sends a verification email' })
  @ApiResponse({ status: HttpStatus.OK, type: UserEntity })
  public async signUp(@Body() data: SignUpDto) {
    return await this.userService.signUp(data)
  }
}
