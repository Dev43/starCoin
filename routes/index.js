var express = require('express');
var qtumLib = require('../qtum-js/src/index');
var qtum = require('../qtum-promise/lib/index');
const { exec } = require('child_process');
const IPFS = require('ipfs')
var utils = require('ethereumjs-util');

// const node = new IPFS()

var router = express.Router();
var contractAddress = 'f84a39b9a4cbd1b84f824d587ef7f43b297f3a82';

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

/* POST with data */
router.get('/merchant', function(req, res, next) {
  var secret = req.secret || '1234' ; // secret needs to be 64 of length
  var s = (utils.sha3(secret).toString('hex'))
  var address = req.address || 'qgsipVVLjq1WsTwmfXp39jjs8jGRyinrkE'; // "product address"
  executeOnBlockchain(['gethexaddress', address])
  .then((hexAddress) => {
    const formattedData = exec(`ethabi encode function ./contractAbi.json register -p ${hexAddress} -p ${s} --lenient`);
    formattedData.stdout.on('data', (data) => {
      console.log(data)
        executeOnBlockchain(['callcontract', contractAddress, data]).then(console.log)
        executeOnBlockchain(['sendtocontract', contractAddress, data]).then((txInfo) => {
          res.status(200).send({ txInfo });
        })
    });

        formattedData.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        formattedData.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });
  });

});

/* POST data to the blockchain for the user */
router.get('/user', function(req, res, next) {
  var review_ipfs_address = req.review_ipfs_address ? JSON.stringify(req.review_address) : 'ffc2cb56036e8a052fea7ca3de726d14df83695f'; // maybe send to IPFS
  var pre_hash_secret = req.pre_hash_secret ? JSON.stringify(req.pre_hash_secret) : '1234';
  var product_id = req.product_id || 'qgsipVVLjq1WsTwmfXp39jjs8jGRyinrkE'; //"product address"
  executeOnBlockchain(['gethexaddress', product_id])
  .then((hexAddress_product) => {
    const formattedData = exec(`ethabi encode function ./contractAbi.json review -p ${hexAddress_product} -p ${review_ipfs_address} -p ${pre_hash_secret} --lenient`);
    formattedData.stdout.on('data', (data) => {
      console.log(data)
        executeOnBlockchain(['callcontract', contractAddress, data]).then(console.log)
        executeOnBlockchain(['sendtocontract', contractAddress, data]).then((txInfo) => {
          res.status(200).send({ txInfo });
        })
    });

        formattedData.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        formattedData.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });
  });
});

module.exports = router;
