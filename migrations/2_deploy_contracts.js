var wallet = artifacts.require("SimpleWallet");
var TACVoting = artifacts.require("./../contracts/TACVoting.sol");
var SafeMath = artifacts.require("./../contracts/SafeMath.sol");
var TACCrowdSale = artifacts.require("TACCrowdSale");

var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

accounts = web3.eth.accounts;

module.exports = function(deployer, accounts) {

  deployer.deploy(SafeMath);
  deployer.link(SafeMath, [TACCrowdSale, TACVoting]);
  deployer.deploy(wallet, ["0x3778622ae23d2696effe148035f1f53b896ad8fc"], 1, 1000, {from:"0x11a0c59c2ee6eb01c90b22c71cdd769bb2dccf63"})
  .then(function(){
    return deployer.deploy(TACVoting, ["0x3778622ae23d2696effe148035f1f53b896ad8fc"], {from:"0x11a0c59c2ee6eb01c90b22c71cdd769bb2dccf63"})})
  .then(function(){
    return deployer.deploy(TACCrowdSale, 1503561600, 1503734400, wallet.address, "0xc8ee7db25eeb695d81779210b5742c103c7884c4", TACVoting.address, {from:"0x11a0c59c2ee6eb01c90b22c71cdd769bb2dccf63"})
  });
};
