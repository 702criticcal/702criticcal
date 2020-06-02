
//0xb84b12e953f5bcf01b05f926728e855f2d4a67a9  contract address on rinkeby
//deployed using remix 
pragma solidity ^0.5.12;

contract Contract {
   string ipfsHash;
   
    mapping (address=>uint16) MyResume;
    function sendHash(string memory x) public {
      ipfsHash = x;
    }

    function getHash() public view returns (string memory x) {
      return ipfsHash;
    }

    function buyResume() payable external {
        MyResume[msg.sender]++;

    }
    
    function GetMyResume() view external returns (uint16){
        return MyResume[msg.sender];
    } 


}