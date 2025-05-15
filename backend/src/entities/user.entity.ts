import { ApiProperty } from "@nestjs/swagger"
import { User } from "@prisma/client"
import { Exclude } from "class-transformer"
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator"

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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role: string

  @ApiProperty()
  @IsDate()
  createdAt: Date

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  @Exclude()
  deletedAt: Date
}
