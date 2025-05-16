import { SetMetadata } from "@nestjs/common"

export const IS_LOGOUT = 'isLogout'

export const AuthLogout = () => SetMetadata(IS_LOGOUT, true)
