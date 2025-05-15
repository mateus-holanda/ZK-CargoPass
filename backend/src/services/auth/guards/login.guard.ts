import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport"

@Injectable()
export class LoginGuard extends PassportAuthGuard('local') {
  public async canActivate(context: ExecutionContext) {
    const result = Boolean(await super.canActivate(context))

    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest()
      await super.logIn(request)
      return result
    }
  }
}
