// 이 DAPP를 어디에, 어떻게 연결할 것인지를 정의해줍니다.
typeof web3 !== 'undefined' // web3가 'undefined'와 
  ? (web3 = new Web3(web3.currentProvider)) // 같다면(?), currentProvider에 연결을 시도합니다. ex) metamask 사용
  : (web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))); // 다르다면(?), HttpProvider에 연결합니다.
  // currentProvider : (?), HttpProvider : (?)
if (web3.isConnected()) {
  console.log('connected'); // 크롬에서 F12 누를 시에 console 탭에서 출력됨. 주로 로그가 어디까지 찍혔는지 확인하여 어디가 문젠지 체크하기 위할 때 사용.
} else {
  console.log('not connected'); // 크롬에서 F12 누를 시에 console 탭에서 출력됨.
  exit;
}

// 잔고를 출력합니다. 잔고에 변화가 있을 시, 새로고침.
function refreshBalance() {
  // tablePlace를 초기화하고 계좌수 만큼 테이블의 행을 생성합니다.
  document.getElementById('tablePlace').innerText = '';
  const idiv = document.createElement('div');
  document.getElementById('tablePlace').appendChild(idiv);
  const list = web3.eth.accounts; // web3라는 api를 이용해 블록체인에 있는 계정을 리스트에 넣음.
  let total = 0;
  let input = '<table>';

  // 잔액 출력
  list.map(el => {
    const tempB = parseFloat(web3.fromWei(web3.eth.getBalance(el), 'ether')); // wei 단위의 잔액을 ether 단위로 변환하여 가져옴.
    input += `
      <tr>
        <td>
          ${el}
        </td>
        <td>
          ${tempB} Eth
        </td>
      </tr>
      `;
    total += tempB;
  });

  input += `
    <tr>
      <td>
        <strong>Total </strong>
      </td>
      <td>
        <strong><font color='red'>${total} Eth</font></strong>
      </td>
    </tr>
  `;
  idiv.innerHTML = input;
  web3.eth.filter('latest').watch(() => { // latest 라는 필터가 검출되는 걸 보고 있다가, refreshBalance 함수 재귀호출.
    refreshBalance();
  });
}

function createNewAccount() {
  console.log('New Account');
  web3.personal.newAccount(document.getElementById('pass').value); // document.getElementById('pass').value 로 입력받은 비밀번호로 블록체인 계정 생성
  web3.eth.filter('latest').watch(() => { // 새로고침이 안되는 에러가 있음. 다른 필터 사용해야 함?
    refreshBalance();
  });
}

// 사용자의 계좌들을 select로 만듭니다.
function makeSelect() {
  const list = web3.eth.accounts;
  const select = document.getElementById('accounts');
  const receiver = document.getElementById('receiver');

  list.map(el => {
    const opt = document.createElement('option');
    opt.value = el;
    opt.innerHTML = el;
    const opt2 = document.createElement('option');
    opt2.value = el;
    opt2.innerHTML = el;
    select.appendChild(opt);
    receiver.appendChild(opt2);
  });
}

function send() {
  const address = document.getElementById('accounts').value; // 송신 선택
  const toAddress = document.getElementById('receiver').value; // 수신 선택
  const amount = web3.toWei(document.getElementById('amount').value, 'ether'); // 송금 액수 선택

  if (
    web3.personal.unlockAccount(address, document.getElementById('pass').value) // 계정 잠금 해제
  ) {
    web3.eth.sendTransaction(
      { from: address, to: toAddress, value: amount },
      (err, result) => {
        if (!err) { // 트랜잭션에 문제가 없다면,
          document.getElementById('message').innerText = ' ';
          const idiv = document.createElement('div');
          document.getElementById('message').appendChild(idiv);
          let input = `
            <p>
              Result: ${result}
            </p>
          `;
          idiv.innerHTML = input;
          console.log(`Transaction is sent Successful! ${result} `);
        } else console.log(err); // 트랜잭션에 에러가 있다면 err 출력
      }
    );
  }
}
