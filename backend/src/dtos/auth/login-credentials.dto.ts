import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class LoginCredentialsDto {
  @ApiProperty({ required: true, example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ required: true, example: 'password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  password: string
}
