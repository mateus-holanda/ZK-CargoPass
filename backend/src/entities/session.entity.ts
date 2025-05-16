import { ApiProperty } from "@nestjs/swagger"
import { IsEnum } from "class-validator"
import { UserEntity } from "./user.entity"

export enum SessionRole {
  ADMIN = 'ADMIN',
  CUSTOM = 'CUSTOM',
  IMPORTER = 'IMPORTER',
}

export class SessionEntity {
  constructor(partial: Partial<SessionEntity>) {
    Object.assign(this, partial)
  }

  @ApiProperty()
  user: UserEntity

  @ApiProperty()
  scopes: string[]

  @ApiProperty()
  @IsEnum(SessionRole)
  sessionRole: SessionRole
}
