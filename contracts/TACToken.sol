
pragma solidity ^0.4.11;


import "./CappedCrowdsale.sol";
import "./MintableToken.sol";
import "./TokenBonus.sol";
import "./SimpleWallet.sol";
import "./TACVoting.sol";

/**
 * @title TACCrowdSaleToken
 * @dev Very simple ERC20 Token that can be minted.
 * It is meant to be used in a crowdsale contract.
 */
contract TACtoken is MintableToken {

  string public constant name = "Titan Tokens";
  string public constant symbol = "TAC";
  uint8 public constant decimals = 18;

}

/**
 * @title TACCrowdSale
 * @dev This is an example of a fully fledged crowdsale.
 * The way to add new features to a base crowdsale is by multiple inheritance.
 * In this example we are providing following extensions:
 * CappedCrowdsale - sets a max boundary for raised funds
 * RefundableCrowdsale - set a min goal to be reached and returns funds if it's not met
 *
 * After adding multiple features it's good practice to run integration tests
 * to ensure that subcontracts works together as intended.
 */
contract TACCrowdSale is CappedCrowdsale {

  function TACCrowdSale(uint256 _startTime, uint256 _endTime , address _wallet, address _owner, address _sponsor, address _TACvoting)
    Crowdsale(_startTime, _endTime, _wallet, _owner, _sponsor, _TACvoting)
  {
    //As goal needs to be met for a successful crowdsale
    //the value needs to less or equal than a cap which is limit for accepted funds
  }

  function createTokenContract() internal returns (MintableToken) {
    return new TACtoken();
  }

  function createTokenBonusContract(address tokenAddress, address _TACvoting) internal returns (TokenBonus) {
    return new TokenBonus(tokenAddress, _TACvoting);
  }
}
