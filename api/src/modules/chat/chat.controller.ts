import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import { ChatMessageDto } from "./chat.dto";
import { ChatService } from "./chat.service";

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  private requireUser(payload: JwtPayload) {
    if (payload.kind !== "user") throw new ForbiddenException("仅门户用户可访问");
  }

  /** 流式对话（SSE） */
  @Post()
  stream(@CurrentUser() payload: JwtPayload, @Body() dto: ChatMessageDto, @Res() res: Response) {
    if (payload.kind !== "user") {
      res.status(403).json({ statusCode: 403, message: "仅门户用户可访问" });
      return;
    }
    return this.chat.streamChat(payload.sub, dto, res);
  }

  @Get("conversations")
  listConversations(@CurrentUser() payload: JwtPayload) {
    this.requireUser(payload);
    return this.chat.listConversations(payload.sub);
  }

  @Get("conversations/:id/messages")
  async listMessages(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    this.requireUser(payload);
    const result = await this.chat.listMessages(payload.sub, id);
    if (!result) throw new NotFoundException("会话不存在");
    return result;
  }

  @Delete("conversations/:id")
  async removeConversation(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    this.requireUser(payload);
    const result = await this.chat.removeConversation(payload.sub, id);
    if (!result) throw new NotFoundException("会话不存在");
    return result;
  }
}
