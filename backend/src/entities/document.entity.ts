import { ApiProperty } from "@nestjs/swagger"
import { Document } from "@prisma/client"
import { IsDate, IsNotEmpty, IsOptional, IsString, IsInt, IsObject } from "class-validator"

export class DocumentEntity implements Document {
  constructor(partial: Partial<DocumentEntity>) {
    Object.assign(this, partial)
  }

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string

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

  @ApiProperty()
  @IsDate()
  createdAt: Date

  @ApiProperty()
  @IsOptional()
  @IsDate()
  deletedAt: Date | null
} 