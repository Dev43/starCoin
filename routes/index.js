var express = require('express');
var qtumLib = require('../qtum-js/src/index');
var qtum = require('../qtum-promise/lib/index');


var router = express.Router();
var pubKey = 'qJPfQK8gcT64Siuc4PhzGBXZYFxgi5b7rF';
var privKey = 'cTbQcD8pnnf8RmHupe4VbgugkmwF1NPUrDVYGwzkmPS5xvWU8Tu3';
var contractAddress = '0e0571d0cfe4b5dfa6f5e4e3b0284d915eea1fa9';
var registerFunctionCall = '96f726b0000000000000000000000000000000000000000000000';

/* POST with data */
router.get('/', function(req, res, next) {
  var secret = req.secret;
  
  var client = new qtum.Client({
    host: '159.203.87.162',
    port: 80,
    user: 'user',
    pass: 'user',
    timeout: 30000
  });
  
  function getFromBlockchain(command) {
   return new Promise((resolve, reject) => {
      client.cmd(...command, function(err, balance, resHeaders){
        if (err) reject(err);
          resolve(balance);
        })
    })
  }

      getFromBlockchain(['listunspent'])
      .then((UTXOS) => {
        var lastUTXO = UTXOS.pop();
        return getFromBlockchain(['createrawtransaction', [{"txid": lastUTXO.txid, "vout": lastUTXO.vout}], {"qXdoFwtBsVmgsyvACiLmHPHNmP2CkqGzD1": Math.floor(lastUTXO.amount - 1)}])
        
      }).then((tx) => {
        return getFromBlockchain(['signrawtransaction', tx])
      }).then((signedTx) => {
        return getFromBlockchain(['sendrawtransaction', signedTx.hex, true])
      }).then(console.log)


  

  res.render('index', { title: 'Express' });
});

module.exports = router;



        // var keyPair = qtumLib.ECPair.fromWIF(privKey);
        // keyPair.network.pubKeyHash = 120;
        // keyPair.network.scriptHash = 196
        // keyPair.network.wif = 239
        // var i = Object.assign({}, qtumLib.networks.testnet);
        // i.pubKeyHash = 120;
        // var tx = new qtumLib.TransactionBuilder(i);
        // tx.addInput(lastUTXO.txid, lastUTXO.vout);
        // tx.addOutput('qXdoFwtBsVmgsyvACiLmHPHNmP2CkqGzD1', Math.floor(lastUTXO.amount / 2));
        // tx.addOutput('qJPfQK8gcT64Siuc4PhzGBXZYFxgi5b7rF', Math.floor(lastUTXO.amount / 3));
        // tx.sign(0, keyPair);
        // console.log(tx)
        // var hexTx = tx.build().toHex();
        // console.log(hexTx)