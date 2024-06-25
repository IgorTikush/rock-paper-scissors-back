import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from 'config';
import { Transaction, TransactionSchema } from './user/transaction.schema';
import { WithdrawalModule } from './withdrawals/withdrawal.module';

@Module({
  imports: [
    ChatModule,
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    MongooseModule.forRoot(config.get('mongo')),
    UserModule,
    WithdrawalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
