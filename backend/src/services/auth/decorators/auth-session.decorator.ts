import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Request } from "express"
import { SessionEntity } from "../../../entities/session.entity"

export const AuthSession = createParamDecorator(
  (data: keyof SessionEntity, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const user = context.switchToHttp().getRequest<Request & { user: SessionEntity }>().user
      return data ? user && user[data] : new SessionEntity(user)
    } else if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient()
      const user = client.user
      return data ? user && user[data] : new SessionEntity(user)
    }
    return data
  },
)
