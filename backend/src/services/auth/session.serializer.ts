import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { SessionEntity } from "../../entities/session.entity"
import { AuthService } from "./auth.service"

interface SessionData {
  userId: string
}

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super()
  }

  public serializeUser(
    session: SessionEntity,
    done: (err: Error | null, session?: SessionData) => void,
  ): void {
    done(null, { userId: session.user.id })
  }

  public deserializeUser(
    payload: SessionData,
    done: (err: Error | null, payload?: SessionEntity) => void,
  ): void {
    if (!payload.userId) {
      return done(null, null)
    }
    this.authService
      .retrieveSession(payload.userId)
      .then((session) => {
        done(null, session)
      })
      .catch((err) => {
        console.error(err)
        if (err instanceof UnauthorizedException) {
          return done(null, null)
        }
        done(err)
      })
  }
}
