import { SessionRole } from "../../entities/session.entity"

// All scopes
export enum Scopes {
  AUTH_ADMIN = 'auth:admin',
  AUTH_LOG_IN = 'auth:log-in',
  API_LOGIN = 'api:login',

  CUSTOM_CREATE = 'custom:create',
  CUSTOM_READ_SELF = 'custom:read:self',
  CUSTOM_READ_ALL = 'custom:read:all',
  CUSTOM_WRITE_SELF = 'custom:write:self',
  CUSTOM_WRITE_ALL = 'custom:write:all',
  CUSTOM_DELETE = 'custom:delete',

  IMPORTER_CREATE = 'importer:create',
  IMPORTER_READ_SELF = 'importer:read:self',
  IMPORTER_READ_ALL = 'importer:read:all',
  IMPORTER_WRITE_SELF = 'importer:write:self',
  IMPORTER_WRITE_ALL = 'importer:write:all',
  IMPORTER_DELETE = 'importer:delete',
}

// Default scopes for customs
export const CustomScopes = [
  Scopes.AUTH_LOG_IN,
  Scopes.API_LOGIN,
  Scopes.CUSTOM_CREATE,
  Scopes.CUSTOM_READ_SELF,
  Scopes.CUSTOM_READ_ALL,
  Scopes.CUSTOM_WRITE_SELF,
  Scopes.CUSTOM_WRITE_ALL,
  Scopes.CUSTOM_DELETE,
]

// Default scopes for importers
export const ImporterScopes = [
  Scopes.AUTH_LOG_IN,
  Scopes.API_LOGIN,
  Scopes.IMPORTER_CREATE,
  Scopes.IMPORTER_READ_SELF,
  Scopes.IMPORTER_READ_ALL,
  Scopes.IMPORTER_WRITE_SELF,
  Scopes.IMPORTER_WRITE_ALL,
  Scopes.IMPORTER_DELETE,
]

export const AdminScopes = [Scopes.AUTH_ADMIN].concat(CustomScopes).concat(ImporterScopes)

export const ScopesByRole = {
  [SessionRole.ADMIN]: AdminScopes,
  [SessionRole.CUSTOM]: CustomScopes,
  [SessionRole.IMPORTER]: ImporterScopes,
}
