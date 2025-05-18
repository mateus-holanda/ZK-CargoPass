import { Body, Controller, HttpStatus, Post, Query, Get } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { DocumentCreateDto } from "../../dtos/document-create.dto"
import { DocumentEntity } from "../../entities/document.entity"
import { DocumentService } from "../../services/document/document.service"

@ApiBearerAuth()
@ApiTags('document')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new document' })
  @ApiResponse({ status: HttpStatus.OK, type: DocumentEntity })
  public async create(@Body() data: DocumentCreateDto) {
    return await this.documentService.createDocument(data)
  }

  @Get()
  @ApiOperation({ summary: 'Lists all documents by userId' })
  @ApiResponse({ status: HttpStatus.OK, type: [DocumentEntity] })
  public async listByUserId(@Query('userId') userId: string) {
    return await this.documentService.getDocumentsByUserId(userId)
  }
} 