import { SessionRole } from '../../entities/session.entity'

// All scopes
export enum Scopes {
  AUTH_SUPER_ADMIN = 'auth:super-admin',
  AUTH_ADMIN = 'auth:admin',
  AUTH_LOG_IN = 'auth:log-in',
  API_LOGIN = 'api:login',

  USER_CREATE = 'user:create',
  USER_READ_SELF = 'user:read:self',
  USER_READ_ALL = 'user:read:all',
  USER_WRITE_SELF = 'user:write:self',
  USER_WRITE_ALL = 'user:write:all',
  USER_DELETE = 'user:delete',
}

// Default scopes for users
export const UserScopes = [
  Scopes.AUTH_LOG_IN,
  Scopes.API_LOGIN,
  Scopes.USER_CREATE,
  Scopes.USER_READ_SELF,
  Scopes.USER_READ_ALL,
  Scopes.USER_WRITE_SELF,
  Scopes.USER_WRITE_ALL,
  Scopes.USER_DELETE,
]

export const SuperAdminScopes = [Scopes.AUTH_SUPER_ADMIN, Scopes.AUTH_ADMIN].concat(UserScopes)

export const ScopesByRole = {
  [SessionRole.USER]: UserScopes,
  [SessionRole.SUPER_ADMIN]: SuperAdminScopes,
}
