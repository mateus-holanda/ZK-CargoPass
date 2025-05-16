import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common"
import { Request, Response } from "express"
import { DefaultEntity } from "../entities/default.entity"

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const method = request.method.toUpperCase()
    const exceptionResponse = exception.getResponse()
    const errorMessage = `${exceptionResponse['message'] ? exceptionResponse['message'] : exception.message}`

    response.status(status).json(
      DefaultEntity.error(errorMessage, {
        statusCode: status,
        path: request.url,
      }),
    )

    Logger.debug(`${method} ${request.url} ${status} - ${response.statusMessage}: ${errorMessage}`)
  }
}
