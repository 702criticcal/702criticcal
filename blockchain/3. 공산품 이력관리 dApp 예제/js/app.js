// web3 provider를 이용하여 블록체인에 연결
typeof web3 !== 'undefined'
  ? (web3 = new Web3(web3.currentProvider))
  : (web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545')));

// 연결되었는지 로그로 확인
if (web3.isConnected()) {
  console.log('connected');
} else {
  console.log('not connected');
  exit;
}

// 스마트 컨트랙트의 주소와 abi 코드를 이용하여 컨트랙트 변수 생성
const contractAddress = '0x92ca202a18dADb0B8c93344e6Cc51B432E35EC99';
const smartContract = web3.eth.contract(abi).at(contractAddress);

// 공산품 이력 리스트 출력 함수
function showList() {
  const table = document.getElementById('table1');
  // 이전에 남겼던 이력을 불러오기 위해 이력의 갯수 확인(view 함수)
  length = smartContract.getNumOfProducts();

  // product 이벤트를 확인하여 새로운 이력 출력
  smartContract.product().watch((err, res) => {
    if (!err) {
      console.dir(res);
      const row = table.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const cell5 = row.insertCell(4);
      length = smartContract.getNumOfProducts();
      cell1.innerHTML = length;
      cell2.innerHTML = res.args.productName;
      cell3.innerHTML = res.args.location;
      cell4.innerHTML = res.args.number.c[0];
      cell5.style.width = '60%';
      cell5.innerHTML = new Date(res.args.timestamp.c[0] * 1000);
    }
  });

  // 이전에 남겼던 이력을 출력하기 위한 반복문
  for (let i = 0; i < length; i++) {
    const product = smartContract.getProductStruct(i);
    const toString = product.toString();
    const strArray = toString.split(',');
	
	  console.log(toString);

    const timestamp = new Date(strArray[3] * 1000);
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    cell1.innerHTML = i+1;
    cell2.innerHTML = strArray[0];
    cell3.innerHTML = strArray[1];
    cell4.innerHTML = strArray[2];
    cell5.style.width = '60%';
    cell5.innerHTML = timestamp;
  }
}

// 입력한 값들을 이용하여 새로운 이력을 등록하는 함수
function addProduct() {
  const pronumber = document.getElementById('pronumber').value;
  const proname = document.getElementById('proname').value;
  const proloc = document.getElementById('proloc').value;
  const account = document.getElementById('account').value;

  // 트랜잭션을 제출하기 위해 해당 계좌의 권한을 해제하고, 트랜잭션 제출
  if ( web3.personal.unlockAccount(account, document.getElementById('pass').value) )
  {
    smartContract.addProStru(
      proname,
      proloc,
      pronumber,
      { from: account, gas: 2000000 },
      (err, result) => {
        if (!err) alert('트랜잭션이 성공적으로 전송되었습니다.\n' + result);
      }
    );
  }
}

//처음 앱이 실행되었을 때 showList 함수를 실행하여 블록체인에 공유되어 있는 이력 출력
$(function() {
  showList();
});
