import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { DocumentCreateDto } from "../../dtos/document-create.dto"
import { DocumentEntity } from "../../entities/document.entity"

@Injectable()
export class DocumentService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createDocument(data: DocumentCreateDto) {
    const document = await this.prismaService.document.create({ data })
    return new DocumentEntity(document)
  }

  public async getDocumentsByUserId(userId: string) {
    const documents = await this.prismaService.document.findMany({ where: { userId } })
    return documents.map(doc => new DocumentEntity(doc))
  }
} 