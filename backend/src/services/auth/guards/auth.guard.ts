import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport"
import { SESSION_KEY_NAME } from "../../../middlewares/auth.middleware"
import { IS_LOGOUT } from "../decorators/auth-logout.decorator"
import { IS_PUBLIC } from "../decorators/public.decorator"
import { SCOPES_KEY } from "../decorators/with-scopes.decorator"
import { Scopes } from "../permissions"

@Injectable()
export class AuthGuard extends PassportAuthGuard(['local']) {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  public async canActivate(context: ExecutionContext) {
    const isLogout = this.reflector.get<boolean>(IS_LOGOUT, context.getHandler())
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC, context.getHandler())

    if (isPublic) {
      return true
    }

    const requiredScopes = this.reflector.getAllAndOverride<Scopes[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest()
      if (isLogout) {
        await new Promise<void>((resolve) => {
          request.res.clearCookie(SESSION_KEY_NAME)
          request.session.destroy(() => request.logout(() => resolve()))
        })
        return true
      } else if (
        request.isAuthenticated() &&
        (!requiredScopes ||
          (request.user && requiredScopes?.some((scope) => request.user.scopes?.includes(scope))))
      ) {
        return true
      }
      return Boolean(await super.canActivate(context))
    }
  }
}
