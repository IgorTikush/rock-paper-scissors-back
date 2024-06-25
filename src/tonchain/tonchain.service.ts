import { Injectable } from '@nestjs/common';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { mnemonicNew, mnemonicToPrivateKey, mnemonicToWalletKey } from '@ton/crypto';
import { TonClient, WalletContractV4, internal, toNano } from '@ton/ton';
import * as config from 'config';
// const TonWeb = require('tonweb');
// const nacl = TonWeb.utils.nacl;

@Injectable()
export class TonchainService {
  async send({ walletAddress, amount }) {

    const mnemonic = config.get('wallet'); // your 24 secret words (replace ... with the rest of the words)
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: -1 });

    const endpoint = await getHttpEndpoint({ network: "mainnet" });
    const client = new TonClient({ endpoint });

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    await walletContract.sendTransfer({
      secretKey: key.secretKey,
      seqno: seqno,
      messages: [
        internal({
          to: walletAddress,
          value: toNano(amount), // 0.05 TON
          bounce: false,
        })
      ]
    });

    // wait until confirmed
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
      console.log("waiting for transaction to confirm...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!");
  }

}
