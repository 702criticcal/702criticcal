pragma solidity ^0.5.8;

contract MyToken {
    
    mapping (address=>uint256) public balanceOf;

    // decimal = 소수값을 정수값으로 표현해주는 역할. ether의 경우 decimal=18.
    // 정수값보다 소수값이 훨씬 더 많은 가스를 소모함
    uint8 public decimals;
    // 토큰 이름 정의
    string public symbol;

    // 배포할 때만 실행되는 생성자
    constructor(uint256 initialSupply) public {
        // 초기 발행량을 컨트랙트 생성자의 주소로 넣음.
        balanceOf[msg.sender] = initialSupply;
        decimals = 0;
        symbol = "JBC";
    }

    // 인터페이스에 맞춰서 정의
    function transfer(address _to, uint256 _amount) public returns(bool success) {
        // 보낼 금액보다 많이 소지하고 있는 확인하는 require문
        require(balanceOf[msg.sender] >= _amount);
        // 오버플로우 방지 require문
        require(balanceOf[_to] + _amount >= balanceOf[_to]);

        
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
        
        return true;
    }
    
}