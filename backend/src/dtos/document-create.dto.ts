import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsInt, IsObject } from "class-validator"

export class DocumentCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  size: number

  @ApiProperty()
  @IsObject()
  data: any
} 