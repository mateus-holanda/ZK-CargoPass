import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class SignUpDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string
}
