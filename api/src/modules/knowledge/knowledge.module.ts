import { Module } from "@nestjs/common";
import { UploadsModule } from "../uploads/uploads.module";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";
import { RetrievalService } from "./retrieval.service";

@Module({
  imports: [UploadsModule],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, RetrievalService],
  exports: [RetrievalService],
})
export class KnowledgeModule {}
