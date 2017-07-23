var express = require('express');
var qtumLib = require('../qtum-js/src/index');
var qtum = require('../qtum-promise/lib/index');
var router = express.Router();
var pubKey = 'qJPfQK8gcT64Siuc4PhzGBXZYFxgi5b7rF';
var privKey = 'cTbQcD8pnnf8RmHupe4VbgugkmwF1NPUrDVYGwzkmPS5xvWU8Tu3';

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
  
  client.cmd('getinfo', function(err, balance, resHeaders){
  if (err) return console.log(err);
  console.log('Balance:', balance);
  });
  client.cmd('getbalance', 'xyz', function(err, balance, resHeaders){
  if (err) return console.log(err);
  console.log('Balance:', balance);
  });
  client.cmd('listunspent', function(err, balance, resHeaders){
  if (err) return console.log(err);
  console.log('Balance:', balance);
  });

    var keyPair = qtumLib.ECPair.fromWIF(privKey)
    var tx = new qtumLib.TransactionBuilder()
    console.log(tx, 'fewf')
    console.log( 'fewf')

    tx.addInput('aa94ab02c182214f090e99a0d57021caffd0f195a81c24602b1028b130b63e31', 0)
    tx.addOutput('1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK', 15000)
    tx.sign(0, keyPair)

  

  res.render('index', { title: 'Express' });
});

module.exports = router;


