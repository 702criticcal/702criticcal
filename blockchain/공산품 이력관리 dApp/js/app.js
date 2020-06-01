// web3 provider를 이용하여 블록체인에 연결
// Javascript는 var과 let 자료형을 사용.
var eth_account;


// Ethereum Provider API -> window.ethereum enable() 내장함수 사용.
// Javascript는 비동기 언어(코드가 동시에 수행되는 언어)이기 때문에, then으로 비동기 처리.
// 콜백으로 앞의 enable() 함수의 실행 결과가 accounts 변수에 담기게 됨.
window.ethereum.enable().then(function(accounts){
  eth_account=accounts[0];
  // console.log(accounts);
});

// Web3 라이브러리를 통한 web3 객체 생성
const web3 = new Web3(window.web3.currentProvider);

// web3가 연결되었는지 안되었는지 확인해서 로그 남기기
// 디버그에 유용하게 쓰기 위해 console log를 남김
if (web3.isConnected()) {
  console.log('connected');
} else {
  console.log('not connected');
  // 
  exit;
}


// 스마트 컨트랙트의 주소와 abi 코드를 이용하여 컨트랙트 변수 생성
const contractAddress = '0x6557Eb79806B2969fdDCfE3c6B19Ac076d335811';
const smartContract = web3.eth.contract(abi).at(contractAddress);

// 공산품 이력 리스트 출력 함수
function showList() {
  const table = document.getElementById('table1');
  
  // 이전에 남겼던 이력을 불러오기 위해 이력의 갯수 확인(view 함수)
  smartContract.getNumOfProducts(function(err,res){
      // 이전에 남겼던 이력을 출력하기 위한 반복문
  for (let i = 0; i < res; i++) {
    try {
      smartContract.getProductStruct(i, function (err, res) {

        console.log(res);
        console.log(res[2].c[0]);
        // 비어 있던 table1을 채워주는 구문
        const timestamp = new Date(res[3] * 1000);
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        // innerHTML : 값을 넣어줌
        cell1.innerHTML = i + 1;
        cell2.innerHTML = res[0];
        cell3.innerHTML = res[1];
        cell4.innerHTML = res[2];
        cell5.style.width = '60%';
        cell5.innerHTML = timestamp;
      });
    } catch (error) {
      console.log("err");
    }



  }
    
  });
 
  // product 이벤트를 확인하여 새로운 이력 출력 -> 이벤트 확인을 하지 않으면 값이 새로 들어와도 새로운 이력이 출력되지 않음.
  smartContract.product().watch((err, res) => {
    if (!err) {
 
      const row = table.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);
      smartContract.getNumOfProducts(function(err,res){
        cell1.innerHTML = res.c[0];

      })       
       cell2.innerHTML = res.args.productName;
      cell3.innerHTML = res.args.location;
      cell4.innerHTML = res.args.number.c[0];
      cell5.innerHTML = res.args.price;
      cell6.style.width = '60%';
      cell6.innerHTML = new Date(res.args.timestamp.c[0] * 1000);

    }
  });


}

// 입력한 값들을 이용하여 새로운 이력을 등록하는 함수
// document : HTML 문서를 가리키는 객체
// document.getElementById : input 태그의 id 값을 받아옴.
// document.getElementById('*').value : 입력된 값을 가리킴.
function addProduct() {
  const pronumber = document.getElementById('pronumber').value;
  const proname = document.getElementById('proname').value;
  const proloc = document.getElementById('proloc').value;
  const proprice = document.getElementById('proprice').value;


  // 트랜잭션을 제출하기 위해 해당 계좌의 권한을 해제하고, 트랜잭션 제출

    smartContract.addProStru(
      proname,
      proloc,
      pronumber,
      proprice,
      { from: eth_account, gas: 2000000 },
      // => : call back 파라미터 == function(err, res)
      (err, result) => {
        if (!err) alert('트랜잭션이 성공적으로 전송되었습니다.\n' + result);
      }
    );
  
}

// jqeury 문법
//처음 앱이 실행되었을 때 showList 함수를 실행하여 블록체인에 공유되어 있는 이력 출력
$(function() {
  showList();
});
