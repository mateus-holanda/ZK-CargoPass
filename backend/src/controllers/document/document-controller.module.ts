import { Module } from "@nestjs/common"
import { DocumentServiceModule } from "../../services/document/document-service.module"
import { DocumentController } from "./document.controller"

@Module({
  imports: [DocumentServiceModule],
  providers: [DocumentController],
  controllers: [DocumentController],
})
export class DocumentControllerModule {} 