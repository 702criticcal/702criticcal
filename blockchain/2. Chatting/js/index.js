console.log('starting...');
//connect web3 and check if web3 is connected correctly
if (typeof web3 !== 'undefined') web3 = new Web3(web3.currentProvider);
// set the provider you want from Web3.providers
else web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.190.75:8545')); // 블록체인에 연결

if (web3.isConnected()) console.log('connected');
else console.log('not connected');

web3.eth.defaultAccount = web3.eth.accounts[0]; // 실행하는 계좌 선택

const smartContract = web3.eth // 변수 smartcontract
  .contract(abi) // .contract(abi)
  .at('0x8Ce1dAEBf95CF96F852a0a4655fa5Ee7Aaaa139d'); // .at(contract address)

function show() {
  smartContract.chat().watch((err, res) => { // chat은 솔리디티로 정의한 이벤트, 이벤트를 감시함
    if (!err) {
      const div = document.createElement('div');
      div.className = 'card';
      const date = new Date(res.args.timeStamp.c[0] * 1000);
      const string = `
        <h5 class="card-header">${res.args.name}</h5>
        <div class="card-body">
          <h5 class="card-title">${res.args.message}</h5>
          <p class="card-text">${date}</p>
        </div>
      `;
      div.innerHTML = string;

      document.getElementById('msg').appendChild(div);
    } else console.log(err);
  });
}

$(function() {
  show();

  $('#button').click(() => { // 버튼이 클릭되면
    console.log('submit'); // submit 로그
    if (web3.personal.unlockAccount(web3.eth.defaultAccount, 'eth')) { // 선택한 계좌 언락
      smartContract.setChat($('#name').val(), $('#chatting').val()); // setChat 함수 호출(트랜잭션 요청)
      console.log('데이터를 입력했습니다.'); // 로그
    }
  });
});
