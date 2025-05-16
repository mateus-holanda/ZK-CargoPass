import { ApiProperty } from "@nestjs/swagger"
import { IsObject, IsString } from "class-validator"

export class DefaultEntity<Data = any> {
  constructor(partial: Partial<DefaultEntity<Data>>) {
    Object.assign(this, partial)
  }

  @ApiProperty({ required: true })
  @IsString()
  status: 'ok' | 'error'

  @ApiProperty()
  @IsString()
  message?: string

  @ApiProperty()
  @IsObject()
  data?: Data

  public static async ok<Data = any>(data?: Data) {
    return new DefaultEntity<Data>({ status: 'ok', data: await data })
  }

  public static error<Data = any>(message: string, data?: Data) {
    return new DefaultEntity<Data>({ status: 'error', message, data })
  }
}
