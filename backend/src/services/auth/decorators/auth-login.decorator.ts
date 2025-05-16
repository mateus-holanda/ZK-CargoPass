import { UseGuards } from "@nestjs/common"
import { LoginGuard } from "../guards/login.guard"

export const AuthLogin = () => UseGuards(LoginGuard)
