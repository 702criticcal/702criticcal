pragma solidity ^0.4.4;

contract Token {
    // ERC20의 인터페이스 정의
    function totalSupply() public view returns(uint256 supply) {}

    function balanceOf(address _owner) public view returns(uint256 balance) {}

    function transfer(address _to, uint256 _value) public returns(bool success) {}

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {}

    function approve(address _spender, uint256 _value) public returns(bool success) {}

    function allowance(address _owner, address _spender) public view returns(uint256 remaining) {}

    // 모니터링하면서 함수가 실행될 때 알려주는 역할
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

// Token contract를 상속받는 StandardToken contract
contract StandardToken is Token {
    mapping (address=>uint256) balances;
    uint256 public totalSupply;

    // 송금 함수
    // if 문을 사용하면 코드가 보안에 매우 취약함. (require문 사용 권장)
    function transfer(address _to, uint256 _value) public returns(bool success) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else {
            return false;
        }
    }

    // 잔액 확인 함수
    // view 함수는 가스 소모가 없음.
    function balanceOf(address _owner) public view returns(uint256 balance) {
        return balances[_owner];
    }
}

// Token contract와 StandardToken contract를 상속받는 TestToken contract
contract TestToken is StandardToken {
    string public name;
    uint8 public decimals;
    string public symbol;
    // 다른 사람에게 소유권을 넘기거나, 새로운 컨트랙트로 배포할 때마다 표시해주기 위한 변수
    string public version = 'H1.0';
    // 1 이더로 구매할 수 있는 토큰의 양
    uint256 public Token_OneEthCanBuy;
    // 토큰을 구매하면서 쌓이는 총 이더의 양
    uint256 public totalEthInWei;
    // 토큰 최초 발행자의 주소
    address public fundManager;

    constructor() public {
        fundManager = msg.sender;
        balances[msg.sender] = 1000000000000000000;
        totalSupply = 1000000000000000000;
        name = "JunsuToken";
        decimals = 18;
        symbol = "JTN";
        Token_OneEthCanBuy = 10;
        fundManager = msg.sender;
    }

    // 자동으로 호출되기 때문에 함수 이름이 없음.
    // payable 옵션이 있어야 이더 거래 가능.
    function() external payable {
        totalEthInWei = totalEthInWei + msg.value;
        // 구매자가 사려는 토큰의 양
        uint256 amount = Token_OneEthCanBuy * msg.value;

        require(balances[fundManager] >= amount);
        balances[fundManager] -= amount;
        balances[msg.sender] += amount;
        Transfer(fundManager, msg.sender, amount);
        // 함수 호출자가 fundManager에게 value만큼의 이더를 송금하는 기능의 transfer 내장 함수
        fundManager.transfer(msg.value);
    }
}