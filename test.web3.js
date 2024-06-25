const Web3 = require('web3');
const Common = require('ethereumjs-common').default;
const Tx = require('ethereumjs-tx').Transaction;

const web3 = new Web3('https://speedy-nodes-nyc.moralis.io/dbc27a33a943ec2f46c11554/bsc/testnet');
const addressFrom = "0x45e809e47b45d6b2EBb8aABEe3E71e4438C9C528";
const addressTo = '0xE1b0AA00d30a336A953525C4c47d38D91eC91Ff2';

const privateKey = Buffer.from("d0074feb1f1dfcccb4b291c7a5192a991f940f4ea7392c22c0ac717fd51d3fbd", 'hex');

const common = Common.forCustomChain('mainnet', {
  // name: 'usdt',
  networkId: 97,
  chainId: 97
}, 'petersburg');

const txObject = {
  nonce: '0x2',
  to: addressTo,
  value: web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
  gasLimit: web3.utils.toHex(700000),
  gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
  // data: inputs["txData"],
};



(async () =>{
  const tx = new Tx(txObject,  {common});
  tx.sign(privateKey);

  const serializedTrans = tx.serialize();
  const raw = '0x' + serializedTrans.toString('hex');
  console.log( await
    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
      console.log('txHash:', txHash)
    })
    // web3.eth.getAccounts()
  );
})();

