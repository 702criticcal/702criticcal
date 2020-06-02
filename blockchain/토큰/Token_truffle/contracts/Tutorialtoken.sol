pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Tutorialtoken is ERC20 {
    string public name = "Tutorialtoken";
    string public symbol = "JSD";
    uint public decimals = 2;
    uint public INITIAL_SUPPLY = 100000000;
    
    constructor() public {
        
        _mint(msg.sender, INITIAL_SUPPLY); // msg.sender의 주소로 INITIAL_SUPPLY개의 토큰이 들어갑니다.

    }
}