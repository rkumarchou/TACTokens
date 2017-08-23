var wallet = artifacts.require("SimpleWallet");
var TACVoting = artifacts.require("./../contracts/TACVoting.sol");
var ERC20Basic = artifacts.require("./../contracts/ERC20Basic.sol");
var SafeMath = artifacts.require("./../contracts/SafeMath.sol");
var Ownable = artifacts.require("./../contracts/Ownable.sol");
var ERC20 = artifacts.require("./../contracts/ERC20.sol");
var BasicToken = artifacts.require("./../contracts/BasicToken.sol");
var StandardToken = artifacts.require("./../contracts/StandardToken.sol");
var MintableToken = artifacts.require("./../contracts/MintableToken.sol");
var tokenIncrement = artifacts.require("./../contracts/tokenIncrement.sol");
var Crowdsale = artifacts.require("./../contracts/Crowdsale.sol");
var CappedCrowdsale = artifacts.require("./../contracts/CappedCrowdsale.sol");
var TACCrowdSale = artifacts.require("TACCrowdSale");
var TACtoken = artifacts.require("TACtoken");

var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

accounts = web3.eth.accounts;

module.exports = function(deployer, accounts) {

  // deployer.deploy([wallet, ERC20Basic, SafeMath]);
  // // deployer.autolink(ERC20);
  // deployer.deploy(ERC20);
  // deployer.deploy(Ownable);
  // // deployer.autolink(StandardToken);
  // deployer.deploy(StandardToken);
  // // deployer.autolink(MintableToken);
  // deployer.deploy(MintableToken);
  // // deployer.autolink(tokenIncrement);
  // deployer.deploy(tokenIncrement);
  // // deployer.autolink(Crowdsale);
  // deployer.deploy(Crowdsale);
  // // deployer.autolink(CappedCrowdsale);
  // deployer.deploy(CappedCrowdsale);

  deployer.deploy(SafeMath);

   deployer.deploy(wallet);

     deployer.link(SafeMath, TACVoting);

   deployer.deploy(TACVoting);

    deployer.link(SafeMath, TACCrowdSale);

   deployer.deploy(TACCrowdSale);
  // deployer.deploy(wallet, [accounts[1]], 1, 10000, {from: accounts[0]})
  // .then(function(){
  //   return deployer.deploy(TACVoting, [accounts[1]], {from: accounts[0]});})
  // .then(function(){
  //   deployer.link(SafeMath, TACCrowdSale);
  //   return deployer.deploy(TACCrowdSale, 1503487809, 1503489909, wallet.address, accounts[9], TACVoting.address);)};
};
