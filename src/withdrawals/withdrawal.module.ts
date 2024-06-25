import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Withdrawal, WithdrawalSchema } from "./withrawal.schema";
import { WithdrawalService } from "./withdrawal.service";
import { WithdrawalRepository } from "./withrawal.repository";
import { WithdrawalController } from "./withrawal.controller";
import { TonchainModule } from "../tonchain/tonchain.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Withdrawal.name, schema: WithdrawalSchema }]),
    TonchainModule,
    UserModule,
  ],
  providers: [WithdrawalService, WithdrawalRepository],
  exports: [WithdrawalService],
  controllers: [WithdrawalController]
})
export class WithdrawalModule {}