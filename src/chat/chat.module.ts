import { Module } from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
  ],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}