var should = require('should');
var _ = require('lodash');
var Promise = require('bluebird');
var helpers = require('./helpers');

var Wallet = artifacts.require("SimpleWallet.sol");
var Token = artifacts.require("TACToken.sol");
var TACvoting = artifacts.require("TACvoting.sol");
var time = artifacts.require("currenttime.sol");

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if ((list[i].logIndex === obj.logIndex) && (list[i].transactionHash === obj.transactionHash)) {
            return true;
        }
    }
    return false;
}

contract('TokenSwap', function(accounts) {
  var wallet;
  var walletEvents;
  var watcher;
  var token;
  var token_watcher;
  var crowdsale;
  var crowdsale_watcher;
  var TACvoting;
  var TACvoting_watcher;


  beforeEach(function() {
    if (wallet) {
      walletEvents = [];
      // Set up event watcher
      watcher = wallet.allEvents({}, function (error, event) {
         if (!containsObject(event, walletEvents))
         walletEvents.push(event);
      });
    }
    if (token) {
      token_watcher = token.allEvents({}, function (error, event) {
         if (!containsObject(event, walletEvents))
         walletEvents.push(event);
      });
    }
    if (crowdsale) {
      crowdsale_watcher = crowdsale.allEvents({}, function (error, event) {
         if (!containsObject(event, walletEvents))
         walletEvents.push(event);
      });
    }
    if (TACvoting) {
      TACvoting_watcher = TACvoting.allEvents({}, function (error, event) {
         if (!containsObject(event, walletEvents))
         walletEvents.push(event);
      });
    }


  });
  afterEach(function() {
    if (watcher) {
      watcher.stopWatching();
    }
    if (token_watcher) {
      token_watcher.stopWatching();
    }
    if (TACvoting_watcher) {
      TACvoting_watcher.stopWatching();
    }
    if (crowdsale_watcher) {
      crowdsale_watcher.stopWatching();
    }
  });

  /**
   * Helper method to get owners on the wallet
   *
   * @param wallet
   * @returns array of owners on the wallet
   */
  var getOwners = function(wallet) {
    return wallet.m_numOwners.call()
    .then(function (numOwners) {
      return Promise.all(
        _.range(numOwners).map(function (ownerIndex) {
          return wallet.getOwner.call(ownerIndex);
        })
      );
    });
  };
  console.log("INside test case");
  describe("Token Contract Creation-Time Capped Sale", function() {
    before(function() {
      // Create a new wallet with a limit of 5
      var walletBuf = Wallet.new([accounts[1], accounts[2]], 2, web3.toWei(5, "ether"), {from: accounts[0]});
      var TACvotingBuf = TACvoting.new([accounts[1], accounts[2]], {from: accounts[0]})
      return [walletAddress, TACvotingAddress]
      .then(function(result) {
        wallet = result[0];
        TACvoting = resut[1];
        var time = time.new({from: accounts[0]});
        var Start-Time = time.getTime(1);
        return Token.new( Start-Time + 10, Start-Time + 100, result[0].address, accounts[9], result[1].address, { from: accounts[0] } ); // Starts on 2017/6/10 2pm, 3 days before
        //return Token.new( 1e20, result.address,1495925635, { from: accounts[0] } );
      })
      .then(function(result) {
        var crowdsale = result;
        var token = crowdsale.token();
      })
    });

    it("Token Swap Not Started", function () {
      var otherAccountStartEther = web3.fromWei(web3.eth.getBalance(accounts[3]), 'ether');
      var msigWalletStartEther = web3.fromWei(web3.eth.getBalance(wallet.address), 'ether');
      return Promise.resolve()
      .then(function() {
        return crowdsale.buyTokens( from: web3.eth.accounts[4], value:web3.toWei(50, "ether")
        })
      })
      .then(function(retVal) {
        assert(false, "Supposed to throw but didnt!");
      })
      .catch(function(error) {
        web3.fromWei(web3.eth.getBalance(wallet.address),'ether').should.eql(msigWalletStartEther);
      })
    });
    //
    // it("Token Swap Enabled - Check Mint for first 3 days (Presale) (Less than 20 ETH)", function () {
    //   var otherAccountStartEther = web3.fromWei(web3.eth.getBalance(accounts[2]), 'ether');
    //   var msigWalletStartEther = web3.fromWei(web3.eth.getBalance(wallet.address), 'ether');
    //   return wallet.startTokenSwap()
    //   .then(function() {
    //     return web3.eth.sendTransaction({from: accounts[2], to: wallet.address, value: web3.toWei(5,'ether')})
    //   })
    //   .then(function(retVal) {
    //     assert(false, "Supposed to throw but didnt!");
    //   })
    //   .catch(function(error) {
    //     web3.fromWei(web3.eth.getBalance(wallet.address),'ether').should.eql(msigWalletStartEther);
    //   })
    // });
    //
    // it("Token Swap Enabled - Check Mint for first 3 days (Presale) (More than 20 ETH)", function () {
    //   var otherAccountStartEther = web3.fromWei(web3.eth.getBalance(accounts[2]), 'ether');
    //   var msigWalletStartEther = web3.fromWei(web3.eth.getBalance(wallet.address), 'ether');
    //   return wallet.startTokenSwap()
    //   .then(function() {
    //     return web3.eth.sendTransaction({from: accounts[2], to: wallet.address, value: web3.toWei(20,'ether')})
    //   })
    //   .then(function(retVal) {
    //     web3.fromWei(web3.eth.getBalance(wallet.address),'ether').should.eql(msigWalletStartEther.add(20));
    //     return helpers.waitForEvents(walletEvents, 2); // wait for events to come in
    //   })
    //   .then(function() {
    //     // Check wallet events for Deposit
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'Deposit';
    //     });
    //     confirmationEvent.args._from.should.eql(accounts[2]);
    //     confirmationEvent.args.value.should.eql( web3.toBigNumber(web3.toWei(20, 'ether')) );
    //   })
    //   .then(function() {
    //     // Check wallet events for TokenMint
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'TokenMint';
    //     });
    //     confirmationEvent.args.newTokenHolder.should.eql(accounts[2]);
    //     confirmationEvent.args.amountOfTokens.should.eql( web3.toBigNumber(web3.toWei(20, 'ether') * 140));
    //   })
    // });
    //
    // it("Token Swap Enabled - Check Mint after first 3 days", function () {
    //   var otherAccountStartEther = web3.fromWei(web3.eth.getBalance(accounts[2]), 'ether');
    //   var msigWalletStartEther = web3.fromWei(web3.eth.getBalance(wallet.address), 'ether');
    //   var snapshot_id;
    //   //Promise.delay(1000)
    //   return web3.evm.increaseTime(86400*3)
    //   .then(function() {
    //     return wallet.startTokenSwap()
    //   })
    //   .then(function() {
    //     return web3.eth.sendTransaction({from: accounts[2], to: wallet.address, value: web3.toWei(5,'ether')})
    //   })
    //   .then(function(retVal) {
    //     web3.fromWei(web3.eth.getBalance(wallet.address),'ether').should.eql(msigWalletStartEther.add(5));
    //     walletEvents = [];
    //     return helpers.waitForEvents(walletEvents, 2); // wait for events to come in
    //   })
    //   .then(function() {
    //     // Check wallet events for Deposit
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'Deposit';
    //     });
    //     confirmationEvent.args._from.should.eql(accounts[2]);
    //     confirmationEvent.args.value.should.eql( web3.toBigNumber(web3.toWei(5, 'ether')) );
    //   })
    //   .then(function() {
    //     // Check wallet events for TokenMint
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'TokenMint';
    //     });
    //     confirmationEvent.args.newTokenHolder.should.eql(accounts[2]);
    //     confirmationEvent.args.amountOfTokens.should.eql( web3.toBigNumber(web3.toWei(5, 'ether') * 120));
    //   })
    // });
    //
    // it("Token Swap Enabled - Check Mint after first 3 weeks + 3 days", function () {
    //   var otherAccountStartEther = web3.fromWei(web3.eth.getBalance(accounts[2]), 'ether');
    //   var msigWalletStartEther = web3.fromWei(web3.eth.getBalance(wallet.address), 'ether');
    //   var snapshot_id;
    //
    //   //Promise.delay(1000)
    //   return web3.evm.increaseTime(86400*26)
    //   .then(function() {
    //     return wallet.startTokenSwap()
    //   })
    //   .then(function() {
    //     return web3.eth.sendTransaction({from: accounts[2], to: wallet.address, value: web3.toWei(5,'ether')})
    //   })
    //   .then(function(retVal) {
    //     web3.fromWei(web3.eth.getBalance(wallet.address),'ether').should.eql(msigWalletStartEther.add(5));
    //     walletEvents = [];
    //     return helpers.waitForEvents(walletEvents, 2); // wait for events to come in
    //   })
    //   .then(function() {
    //     // Check wallet events for Deposit
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'Deposit';
    //     });
    //     confirmationEvent.args._from.should.eql(accounts[2]);
    //     confirmationEvent.args.value.should.eql( web3.toBigNumber(web3.toWei(5, 'ether')) );
    //   })
    //   .then(function() {
    //     // Check wallet events for TokenMint
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'TokenMint';
    //     });
    //     confirmationEvent.args.newTokenHolder.should.eql(accounts[2]);
    //     confirmationEvent.args.amountOfTokens.should.eql( web3.toBigNumber(web3.toWei(5, 'ether') * 100));
    //   })
    // });
    //
    // it("Token Swap Enabled - Check Mint after sale", function () {
    //   var otherAccountStartEther = web3.fromWei(web3.eth.getBalance(accounts[2]), 'ether');
    //   var msigWalletStartEther = web3.fromWei(web3.eth.getBalance(wallet.address), 'ether');
    //   return web3.evm.increaseTime(86400*22)
    //   .then(function() {
    //     return web3.eth.sendTransaction({from: accounts[2], to: wallet.address, value: web3.toWei(5,'ether')})
    //   })
    //   .then(function(retVal) {
    //     web3.fromWei(web3.eth.getBalance(wallet.address),'ether').should.eql(msigWalletStartEther.add(5));
    //     walletEvents = []
    //     return helpers.waitForEvents(walletEvents, 3); // wait for events to come in
    //   }).then(function() {
    //     // Check wallet events for TokenSwapOver
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'TokenSwapOver';
    //     });
    //     // Check wallet events for Deposit
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'Deposit';
    //     });
    //     confirmationEvent.args._from.should.eql(accounts[2]);
    //     confirmationEvent.args.value.should.eql( web3.toBigNumber(web3.toWei(5, 'ether')) );
    //     // Check wallet events for TokenMint
    //     var confirmationEvent = _.find(walletEvents, function (event) {
    //       return event.event === 'TokenMint';
    //     });
    //     confirmationEvent.args.newTokenHolder.should.eql(accounts[2]);
    //     confirmationEvent.args.amountOfTokens.should.eql( web3.toBigNumber(web3.toWei(5, 'ether') * 100));
    //   });
    // });
    //
    //
    // it("Withdraw Reserve after TokenSwapOver - Check Total Supply equals 1,250,000e18", function () {
    //   var otherAccountStartEther = web3.fromWei(web3.eth.getBalance(accounts[2]), 'ether');
    //   var msigWalletStartEther = web3.fromWei(web3.eth.getBalance(wallet.address), 'ether');
    //   return wallet.withdrawReserve(accounts[0], {from: accounts[2]})
    //   .then(function() {
    //     walletEvents = [];
    //     return helpers.waitForEvents(walletEvents, 1); // wait for events to come in
    //   })
    //   .then(function() {
    //     return token.totalSupply()
    //   })
    //   .then(function(totalSupply) {
    //     totalSupply.should.eql( web3.toBigNumber( 12500000 * 1e18 ) );
    //   })
    // });
    //
    // it("Withdraw Reserve 2nd call, should throw, supply shouldn't change", function () {
    //   var otherAccountStartEther = web3.fromWei(web3.eth.getBalance(accounts[2]), 'ether');
    //   var msigWalletStartEther = web3.fromWei(web3.eth.getBalance(wallet.address), 'ether');
    //   return wallet.withdrawReserve(accounts[0], {from: accounts[2]})
    //   .then(function() {
    //     assert(false,"Should have thrown!");
    //   })
    //   .catch(function(error) {
    //     helpers.checkIfThrown(error);
    //   })
    //
    //   return token.totalSupply()
    //   .then(function(totalSupply) {
    //     totalSupply.should.eql( web3.toBigNumber( 12500000 * 1e18 ) );
    //   })
    // });
  });
});
