pragma solidity 0.5.8;


/*
contract Token {
    function transfer(address _to, uint256 _value) public returns(bool success) {}

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {}

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
}
*/

contract ProductContract {
    uint8 numberOfProducts; // 총 제품의 수입니다.
    mapping (uint => address) indexToAddress;
    mapping (address => uint) addressToIndex;
    address public productManager;
    uint256 public item_OneEthCanBuy;
    uint256 public totalEthInWei;


    constructor() public {
        productManager = msg.sender;
        uint256 item_OneEthCanBuy = 1;
    }

    struct myStruct {
        string productName; // 공산품 제품명
        string locaton; // 공산품 생산지
        uint number; // 공산품 개수
        uint price; // 공산품 가격
        uint timestamp;
    }

    event product (
        string productName,
        string location,
        uint number,
        uint price,
        uint timestamp
    );

    myStruct[] public productes;

    function addProStru (string memory _firstString, string memory _secondString, uint _initNumber, uint _price) public {
        productes.push(myStruct(_firstString, _secondString, _initNumber, _price, block.timestamp)) -1;
        numberOfProducts++;
        // emit : 이벤트를 발생시키는 구문
        emit product(_firstString, _secondString, _initNumber, _price, block.timestamp);
    }

    // 제품 등록의 수를 리턴합니다.
    function getNumOfProducts() public view returns(uint8) {
        return numberOfProducts;
    }

    // 번호에 해당하는 제품의 정보를 리턴합니다.
    function getProductStruct(uint _index) public view returns (string memory, string memory, uint, uint, uint) {
        return (productes[_index].productName, productes[_index].locaton, productes[_index].number, productes[_index].price, productes[_index].timestamp);
    }

    // 제품을 구매합니다.
    function purchase(uint _index, uint256 _amount) payable public returns (bool success) {
        uint256 items = _amount * msg.value;
        
        require(productes[_index].number >= items);
        require(msg.value >= _amount * productes[_index].price);
        productes[_index].number -= _amount;
        ProductContract.transfer(msg.value);
        
    }

//     // 구매 이력을 리턴합니다. getpurchaseLog(msg.sender)
//     function getpurchaseLog(address _owner) public view returns(string memory, string memory, uint, uint) {
//         addressToIndex[_owner] = 
        
//         return (productes[_index].productName, productes[_index].locaton, productes[_index].number, productes[_index].timestamp);
//     }
}
