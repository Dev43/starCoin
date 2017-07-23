var express = require('express');
var bitcoin = require( 'bitcoin-promise' ) ;
var router = express.Router();
/* POST with data */
router.get('/', function(req, res, next) {

  var client = new bitcoin.Client({
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

  

  res.render('index', { title: 'Express' });
});

module.exports = router;


