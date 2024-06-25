import { Injectable } from '@nestjs/common';
import { Address, TonClient4 } from '@ton/ton';
import { getHttpV4Endpoint } from '@orbs-network/ton-access';
import { GameFiSDK, createHighloadV2 } from '@ton-community/gamefi-sdk';
import * as config from 'config';
import { createHmac } from 'node:crypto';
import { IUser } from './user/interfaces/user.interface';
import { UserService } from './user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './user/transaction.schema';
import { Model } from 'mongoose';
// import { TonClient } from 'ton-client-node-js';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private readonly userService: UserService,
  ) {}
  async getHello(): Promise<string> {
    // const client = new TonClient({
    //   network: {
    //     // Your network configuration
    //     endpoints: ['https://main.ton.dev']
    //   }
    // });

    // const wallet = await createHighloadV2(
    //   'palace strike predict various atom heavy treat copy magic uncover zebra network column lab ankle visual congress outdoor loan craft clerk media bubble climb',
    // );

    // const sdk = await GameFiSDK.create({
    //   api: 'testnet',
    //   wallet,
    //   storage: {
    //     pinataApiKey: 'smth',
    //     pinataSecretKey: 'smth',
    //   },
    // });

    // console.log(lastTx.tx.hash().toString('base64'));
    // console.log(lastTx.tx);
    // const allFees = Number(lastTx.tx.totalFees.coins) / 1000000;

    // const gasUsed =
    //   // @ts-ignore
    //   Number(lastTx.tx.description.computePhase.gasUsed) / 1000000;
    // const gasActive =
    //
    //   Number(lastTx.tx.description.actionPhase.totalActionFees) / 1000000;
    // @ts-ignore

    console.log(lastTx.tx);

    // console.log(allFees - gasUsed - gasActive);
    // console.log(acc);
    return 'huy';
  }

  async handleBuy(user: any, buyerWallet: string): Promise<void> {
    buyerWallet = Address.normalize(buyerWallet);
    const client = new TonClient4({
      endpoint: await getHttpV4Endpoint({ network: 'mainnet' }),
    });

    const lastBlock = await client.getLastBlock();

    const acc = await client.getAccountLite(
      lastBlock.last.seqno,
      'UQDGUvYWclDqT0QySRSXgbUOjmgS-R_Sd851OWgoio_CUtw8' as any,
    );
    const txs = await client.getAccountTransactions(
      'UQDGUvYWclDqT0QySRSXgbUOjmgS-R_Sd851OWgoio_CUtw8' as any,
      acc.account.last.lt as any,
      acc.account.last.hash as any,
    );

    const userTx = txs.find(
      (tx) => {
        // console.log(tx.tx);
        return tx.tx.inMessage.info.src?.toString() === buyerWallet
      },
    );
    console.log('userTx', userTx.tx.hash().toString('base64'));
    if (!userTx) {
      return;
    }

    const transactionInDb = await this.transactionModel.findOne({
      hash: userTx.tx.hash().toString('base64'),
    })

    if (transactionInDb) {
      return;
    }

    await this.transactionModel.create({
      hash: userTx.tx.hash().toString('base64'),
      userId: user.tgId,
      // @ts-ignore
      amount: userTx.tx.inMessage.info.value.coins,
    });

    // @ts-ignore
    const value = Number(userTx.tx.inMessage.info.value.coins) / 1000000000;
    console.log(value);
    if (value) {
      console.log('update balance');
      this.userService.updateBalance(user.id, value);
    }
  }

  hmac(data: string, key: string | Buffer): Buffer {
    return createHmac('sha256', key).update(data).digest();
  }

  processTelegramData(qs: any): any {
    const token = config.get('tg-bot-token');
    const sk = this.hmac(token, 'WebAppData');
    const parts = qs.split('&').map((p) => p.split('='));
    const hashpart = parts.splice(
      parts.findIndex((p) => p[0] === 'hash'),
      1,
    )[0];
    const dcs = parts
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map((p) => decodeURIComponent(p.join('=')))
      .join('\n');
    if (this.hmac(dcs, sk).toString('hex') !== hashpart[1])
      return { ok: false };
    const o: Record<string, string> = {};
    for (const part of parts) {
      o[part[0]] = decodeURIComponent(part[1]);
    }
    return { ok: true, data: o };
  }
}
