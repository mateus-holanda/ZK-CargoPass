import { Module } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { DocumentService } from "./document.service"

@Module({
  providers: [DocumentService, PrismaService],
  exports: [DocumentService],
})
export class DocumentServiceModule {} 