pragma solidity ^0.4.11;

import './Ownable.sol';
import './SafeMath.sol';
import './MintableToken.sol';


contract tokenIncrement is Ownable {
  using SafeMath for uint256;


  event TokenHolderInitialized (uint _index, bool status);
  address public TACAddress;


  MintableToken public token;

  // Stores the status of the token increment activity
  // Points to the next increment index number. Set to 1 by default.
  uint public nextIncrementIndexNumber = 1;

  // A mapping that stores the values of increment corresponding
  // to each increment index. For ex- If the percentage increment is
  // 10 % for 1st index and 20% for 2nd index, the mapping stores [(1,10), (2,20)]
  mapping (uint => uint) public increments;


  // A boolean that stores if token increment has been called by the owner from
  // the TACvoting contract.
  bool public tokenIncrementInitiated;

  // mapping that keeps track of the increment index at
  // which the owner is.
  mapping (address => uint) public tokenHolderIncrementIndex;


  // Modifier to make sure that a function is only called from
  // the TACvoting contract.
  modifier onlyFromTAC {
    require (msg.sender == TACAddress);
    _;
  }

  /*// Modifier to check if an address already is a tokenHolder
  modifier isTokenHolder (address _addr) {
    require (existingTokenHolder[uint(_addr)]);
    _;
  }*/

  // Modifier to check if an address is eligible for token increment
  // by checking the tokenHolders increment index.
  modifier eligibleForTokenIncrement (address _addr) {
    require (tokenHolderIncrementIndex[_addr] < (nextIncrementIndexNumber - 1));
    _;
  }

  function tokenIncrement (address _tokenContractAddress, address _TACvotingAddress) {
    TACAddress = _TACvotingAddress;
    token = MintableToken(_tokenContractAddress);
  }

  function checkBalance (address _addr) constant returns (uint) {
    return token.balanceOf(_addr);
  }

  function checkIncrements (uint _index) returns (uint) {
    return increments[_index];
  }

  // Function that is called from the TACvoting contract
  // whenever a special proposal corresponding to increment of tokens
  // is called.
  function addIncrement (uint _incrementPercentage)
    onlyFromTAC {
        tokenIncrementInitiated = true;
        increments[nextIncrementIndexNumber] = _incrementPercentage;
        nextIncrementIndexNumber ++;
    }

  // Function that mints the token increment, called from the wallet.
  // Mints all the token increments till date for a specific beneficiary.
  // Called from the Wallet through the 'claimTokenIncrement' function.
  function mintTokenIncrement (address beneficiary)
    onlyOwner
    eligibleForTokenIncrement(beneficiary)
    returns (uint) {
      uint256 i = tokenHolderIncrementIndex[beneficiary];
      uint totalBalance = token.balanceOf(beneficiary);
      uint totalTokens;
      while (i < (nextIncrementIndexNumber-1)) {

        uint tokens = (increments[i+1].mul(totalBalance))/100;
        totalBalance = totalBalance.add(tokens);
        totalTokens = totalTokens.add(tokens);
        i++;
      }
      tokenHolderIncrementIndex[beneficiary] = i;
      return totalTokens;
    }

}
