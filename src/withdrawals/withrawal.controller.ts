import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { WebAppDataGuard } from '../guards/webAppDataGuard';
import { IUser } from '../user/interfaces/user.interface';
import { WithdrawalService } from './withdrawal.service';

@Controller('withdraw')
export class WithdrawalController {
  constructor(
    private readonly withdrawalService: WithdrawalService,
  ) {}

  @Post()
  @UseGuards(WebAppDataGuard)
  async withraw(@Req() { user }: { user: IUser }, @Headers() { wallet }) {
    await this.withdrawalService.create({ user, wallet });
    return 'ok';
  }
}