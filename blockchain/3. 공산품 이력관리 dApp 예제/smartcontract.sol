pragma solidity 0.4.26;

contract ProductContract {
    uint8 numberOfProducts; // 총 제품의 수입니다.

    struct myStruct {
        string productName;
        string locaton;
        uint number;
        uint timestamp;
    }

    event product (
        string productName,
        string location,
        uint number,
        uint timestamp
    );

    myStruct[] public productes;

    function addProStru (string memory _firstString, string memory _secondString, uint _initNumber) public {
        productes.push(myStruct(_firstString, _secondString, _initNumber, block.timestamp)) -1;
        numberOfProducts++;
        emit product(_firstString, _secondString, _initNumber, block.timestamp);
    }

    //제품 등록의 수를 리턴합니다.
    function getNumOfProducts() public view returns(uint8) {
        return numberOfProducts;
    }

    //번호에 해당하는 제품의 이름을 리턴합니다.
    function getProductStruct(uint _index) public view returns (string memory, string memory, uint, uint) {
        return (productes[_index].productName, productes[_index].locaton, productes[_index].number, productes[_index].timestamp);
    }
}