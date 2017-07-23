var express = require('express');
var qtumLib = require('../qtum-js/src/index');
var qtum = require('../qtum-promise/lib/index');
const { exec } = require('child_process');

var router = express.Router();
var contractAddress = 'f84a39b9a4cbd1b84f824d587ef7f43b297f3a82';

/* POST with data */
router.get('/', function(req, res, next) {
  var secret = req.secret || '1761766f66796f726b1111000000000000000000000000000000000000000100' ; // secret needs to be 64 of length
  var s = (qtumLib.crypto.sha256(secret).toString('hex'))
  var address = req.address || 'f84a39b9a4cbd1b84f824d587ef7f43b297f3a82'; // contract address
  
  
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

      const formattedData = exec(`ethabi encode function ./contractAbi.json register -p ${address} -p ${s} --lenient`);

      formattedData.stdout.on('data', (data) => {
        console.log(data)
        executeOnBlockchain(['callcontract', contractAddress, data]).then(console.log)
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



 