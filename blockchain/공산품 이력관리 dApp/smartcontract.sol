pragma solidity 0.5.8;

contract Pay {
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

contract ProductContract is Pay {
    uint8 numberOfProducts; // 총 제품의 수입니다.
    mapping (uint => address) indexToAddress;
    mapping (address => uint) addressToIndex;
    address public productManager;


    constructor() public {
        productManager = msg.sender;
    }

    struct myStruct {
        string productName; // 제품명
        string locaton; // 제품 생산지
        uint price; // 제품 가격
        address owner; // 소유자 or 구매자
        uint timestamp;
    }

    event product (
        string productName,
        string location,
        uint price,
        address owner,
        uint timestamp
    );

    myStruct[] public productes;
    myStruct[] public soldProducts;

    function addProStru (string memory _firstString, string memory _secondString, uint _price) public {
        productes.push(myStruct(_firstString, _secondString, _price, msg.sender, block.timestamp)) - 1;
        numberOfProducts++;
        // emit : 이벤트를 발생시키는 구문
        emit product(_firstString, _secondString, _price, msg.sender, block.timestamp);
    }

    // 제품 등록의 수를 리턴합니다.
    function getNumOfProducts() public view returns(uint8) {
        return numberOfProducts;
    }

    // 번호에 해당하는 제품의 정보를 리턴합니다.
    function getProductStruct(uint _index) public view returns (string memory, string memory, uint, address, uint) {
        return (productes[_index].productName, productes[_index].locaton, productes[_index].price, productes[_index].owner, productes[_index].timestamp);
    }

    // 제품을 구매합니다.
    function purchase(uint _index) payable public returns (bool success) {
        require(msg.value == productes[_index].price); // 구매하고 싶은 제품의 구매 가격

        emit Transfer(msg.sender, productes[_index].owner, msg.value);
        transferFrom(msg.sender, productes[_index].owner, msg.value);

        indexToAddress[_index] = msg.sender;
        numberOfProducts--;
        soldProducts.push(productes[_index]) - 1;
        delete productes[_index];
    }

    // 구매 이력을 리턴합니다.
    function getPurchaseLog(address _owner) public view returns(string memory, string memory, uint, address, uint) {
        return (soldProducts[addressToIndex[msg.sender]].productName, soldProducts[addressToIndex[msg.sender]].locaton, soldProducts[addressToIndex[msg.sender]].price, soldProducts[addressToIndex[msg.sender]].owner, soldProducts[addressToIndex[msg.sender]].timestamp);
    }

    // // 구매 이력을 리턴합니다.
    // function getPurchaseLog(address _owner) public view returns(string, string, uint, address, uint) onlyOwner {
    //     return (soldProducts[addressToIndex[msg.sender]].productName, soldProducts[addressToIndex[msg.sender]].locaton, soldProducts[addressToIndex[msg.sender]].price, soldProducts[addressToIndex[msg.sender]].owner, soldProducts[addressToIndex[msg.sender]].timestamp);
    // }

    // // msg.sender가 구매자 or productManager인지 확인합니다.
    // modifier onlyOwner {
    //     require(validOwner(msg.sender) || msg.sender == productManager);
    //     _;
    // }

    // // msg.sender가 구매자인지 확인합니다.
    // function validOwner(address _owner) public view returns(bool) {
    //     for(uint i = 0; i < soldProducts.length; i++){
    //         if(soldProducts[i].owner == _owner) {
    //             return true;
    //         }
    //     }
    // }
}
