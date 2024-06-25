import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { WithdrawalRepository } from './withrawal.repository';
import { TonchainService } from '../tonchain/tonchain.service';

@Injectable()
export class WithdrawalService {
  private readonly commissionPercent = 0.03;
  constructor(
    private withdrawalRepository: WithdrawalRepository,
    private tonchainService: TonchainService,
    private userService: UserService,
  ) {}

  async create({ user, wallet }) {
    const balance = await this.userService.getBalance(user.tgId);
    const commission = balance * this.commissionPercent;
    const amount = balance - commission;

    await this.tonchainService.send({ walletAddress: wallet, amount });
    await this.userService.updateBalance(user.tgId, -balance);
    await this.withdrawalRepository.create({ wallet, amount, commission, user })
  }
}