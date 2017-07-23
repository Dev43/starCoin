var express = require('express');
var qtumLib = require('../qtum-js/src/index');
var qtum = require('../qtum-promise/lib/index');
const { exec } = require('child_process');

var router = express.Router();
var pubKey = 'qJPfQK8gcT64Siuc4PhzGBXZYFxgi5b7rF';
var privKey = 'cTbQcD8pnnf8RmHupe4VbgugkmwF1NPUrDVYGwzkmPS5xvWU8Tu3';
var contractAddress = '0e0571d0cfe4b5dfa6f5e4e3b0284d915eea1fa9';
var registerFunctionCall = '96f726b0000000000000000000000000000000000000000000000';

/* POST with data */
router.get('/', function(req, res, next) {
  var secret = req.secret || '1761766f66796f726b1111000000000000000000000000000000000000000100' ;
  var address = req.address || '844864f8792fb7f20e2daa893de8f3a465749fdf';
  
  
  var client = new qtum.Client({
    host: '159.203.87.162',
    port: 80,
    user: 'user',
    pass: 'user',
    timeout: 30000
  });
  
  function executeOnBlockchain(command) {
   return new Promise((resolve, reject) => {
      client.cmd(...command, function(err, balance, resHeaders){
        if (err) reject(err);
          resolve(balance);
        })
    })
  }

      // executeOnBlockchain(['listunspent'])
      // .then((UTXOS) => {
      //   var lastUTXO = UTXOS.pop();
      //   return executeOnBlockchain(['createrawtransaction', [{"txid": lastUTXO.txid, "vout": lastUTXO.vout}], {"qXdoFwtBsVmgsyvACiLmHPHNmP2CkqGzD1": Math.floor(lastUTXO.amount - 1)}])
        
      // }).then((tx) => {
      //   return executeOnBlockchain(['signrawtransaction', tx])
      // }).then((signedTx) => {
      //   return executeOnBlockchain(['sendrawtransaction', signedTx.hex, true])
      // }).then(console.log)


      const formattedData = exec(`ethabi encode function ./contractAbi.json register -p ${address} ${secret} --lenient`);
      // const formattedData = exec(`ethabi encode function ./contractAbi.json register -p 0e0571d0cfe4b5dfa6f5e4e3b0284d915eea1fa9 6761766f66796f726b0000000000000000000000000000000000000000000000`);

      formattedData.stdout.on('data', (data) => {
        console.log(data)
        executeOnBlockchain(['sendtocontract', contractAddress, data]).then(console.log)
      });

      formattedData.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      formattedData.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
  

  res.status(200).send({ title: 'Express' });
});

module.exports = router;



 