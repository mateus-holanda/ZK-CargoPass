import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Request } from "express"
import { Strategy } from "passport-local"

import { SessionEntity } from "../../../entities/session.entity"
import { AuthService } from "../auth.service"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    })
  }

  public validate(req: Request, email: string, password: string): Promise<SessionEntity> {
    return this.authService.login(email, password)
  }
}