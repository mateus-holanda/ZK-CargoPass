import { ApiProperty } from "@nestjs/swagger"
import { User, UserRole } from "@prisma/client"
import { Exclude } from "class-transformer"
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Exclude()
  password: string

  @Exclude()
  salt: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole

  @ApiProperty()
  @IsDate()
  createdAt: Date

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  @Exclude()
  deletedAt: Date
}
