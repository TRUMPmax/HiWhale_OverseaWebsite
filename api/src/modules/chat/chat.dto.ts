import { IsOptional, IsString, MinLength } from "class-validator";

export class ChatMessageDto {
  @IsString()
  @MinLength(1, { message: "消息不能为空" })
  message: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  /** 发起对话时的产品型号上下文（存入会话） */
  @IsOptional()
  @IsString()
  productModel?: string;
}
