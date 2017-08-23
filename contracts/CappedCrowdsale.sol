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

  // overriding Crowdsale#hasEnded to add cap logic
  // @return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    bool capReached = totalSupply >= tokenCap;
    return super.hasEnded() || capReached;
  }

  function getEtherAMOUNTForRemainingTokens () returns (uint) {
    uint value = (tokenCap - totalSupply) / SponsorSwapRate;
    return value;
  }
}
