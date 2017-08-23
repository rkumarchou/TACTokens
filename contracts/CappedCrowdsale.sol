pragma solidity ^0.4.11;

import './SafeMath.sol';
import './Crowdsale.sol';

/**
 * @title CappedCrowdsale
 * @dev Extension of Crowsdale with a max amount of funds raised
 */
contract CappedCrowdsale is Crowdsale {
  using SafeMath for uint256;

  uint256 public tokenCap = 6500000e18;

  // overriding Crowdsale#validPurchase to add extra cap logic
  // @return true if investors can buy at the moment
  function validPurchase() internal constant returns (bool) {
    bool withinCap = totalSupply.add(msg.value * swaprate) <= tokenCap;
    return super.validPurchase() && withinCap;
  }

  // overriding Crowdsale#validPurchaseForSponsor to add extra cap logic
  // @return true if sponsor can buy at the moment
  function validPurchaseForSponsor() internal constant returns (bool) {
    bool withinCap = totalSupply.add(msg.value * SponsorSwapRate) <= tokenCap;
    return super.validPurchaseForSponsor() && withinCap;
  }

  // overriding Crowdsale#hasEnded to add cap logic
  // @return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    bool capReached = totalSupply >= tokenCap;
    return super.hasEnded() || capReached;
  }

  function getEtherAmountForSponsorPurchase () returns (uint) {
    uint value = (tokenCap - totalSupply) / (SponsorSwapRate * 1e18);
    return value;
  }
}
