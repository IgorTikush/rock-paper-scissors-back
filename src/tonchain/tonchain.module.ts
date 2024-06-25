import { Module } from "@nestjs/common";
import { TonchainService } from "./tonchain.service";

@Module({
  exports: [TonchainService],
  providers: [TonchainService],
})
export class TonchainModule {}