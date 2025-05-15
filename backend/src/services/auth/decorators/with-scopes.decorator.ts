import { SetMetadata } from "@nestjs/common"
import { Scopes } from "../permissions"

export const SCOPES_KEY = 'scopes'
export const WithScopes = (...scopes: Scopes[]) => SetMetadata(SCOPES_KEY, scopes)
