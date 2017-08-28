var wallet = artifacts.require("SimpleWallet");
var TACVoting = artifacts.require("./../contracts/TACVoting.sol");
var SafeMath = artifacts.require("./../contracts/SafeMath.sol");
var TACCrowdSale = artifacts.require("TACCrowdSale");


module.exports = function(deployer, accounts) {

  deployer.deploy(SafeMath);
  deployer.link(SafeMath, [TACCrowdSale, TACVoting]);
  deployer.deploy(wallet, ["0x5bce47dd07cafae239185612ac8bdfd03e1b39c0"], 1, 1000, {from:"0x11a0c59c2ee6eb01c90b22c71cdd769bb2dccf63"})
  .then(function(){
    return deployer.deploy(TACVoting, ["0x5bce47dd07cafae239185612ac8bdfd03e1b39c0"], {from:"0x11a0c59c2ee6eb01c90b22c71cdd769bb2dccf63"})})
  .then(function(){
    return deployer.deploy(TACCrowdSale, 1503561600, 1503734400, wallet.address, "0xE98F0290C80573FDf6137352C6dCF9F4E45901fe", TACVoting.address, {from:"0x11a0c59c2ee6eb01c90b22c71cdd769bb2dccf63"})
  });
};
