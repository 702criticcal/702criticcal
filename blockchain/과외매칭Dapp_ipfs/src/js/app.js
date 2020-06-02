App = {
  web3Provider: null,
  contracts: {},
  
  init: function() {
   $.getJSON('../real-estate.json',function(data){
     var list=$('#list');
     var template=$('#template');

     for(i=0;i<data.length;i++){
       template.find('img').attr('src',data[i].picture);
       template.find('.id').text(data[i].id);
       template.find('.type').text(data[i].type);
       template.find('.area').text(data[i].area);
       template.find('.price').text(data[i].price);

       //템플릿에 있는 id 필드 찾고 json파일의 id 데이터 담고
       //템플릿은 list변수에 추가
       list.append(template.html());
     }
    })

    return App.initWeb3(); //밑에 initWeb3 바로 불러옴
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefined'){
      //메타마스크 존재하면(주어진 web3인스턴스 있다면)
      App.web3Provider = web3.currentProvider;
      web3=new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:7545');
      console.log("connect");
      web3 = new Web3(App.web3Provider);
    } //이 rpc서버를 제공하는 local공급자가 가나슈이면 가나슈가 실행

    return App.initContract();
  }, //dapp에서 쓸수있는 web3환경 조성

  initContract: function() {
    $.getJSON('RealEstate.json',function(data){
      //artifact파일 abi정보와 컨트랙트 배포 주소 갖고 있음
      App.contracts.RealEstate = TruffleContract(data); //컨트랙트 인스턴스화
      App.contracts.RealEstate.setProvider(App.web3Provider); //컨트랙트 공급자 설정
      App.listenToEvents();
    })
  },
  //스마트컨트랙트를 인스턴스화, 그래야 web3가 우리 contract 어디서 찾아야하는지 알 수 잇음

  buyRealEstate: function() { 
    var id = $('#id').val();
    var name = $('#name').val();
    var price = $('#price').val();
    var age = $('#age').val();


    //web3 통해 연결된 노드 계정 불러와야
    ethereum.enable().then(function (accounts){
      console.log(accounts);

      var account = accounts[0];
    
      App.contracts.RealEstate.deployed().then(function(instance){      //위의 initContract에서 contract 전역변수에 저장
        var nameUtf8Encoded = utf8.encode(name); //이름 한글로 ->utf8 utf8파일 따로
        console.log(instance);
        return instance.buyRealEstate(id,web3.toHex(nameUtf8Encoded),age,{ from: account, value: price}); 
        //인코딩 후 hex로 바꿔서, buyrealestate 컨트랙트 payable 누가 얼마 보낼지도 보내야
      }).then(function(){
        $('#name').val(''); //제출 누르고 바로 reset되도록
        $('#age').val('');
        $('#buyModal').modal('hide'); //모달 창 닫기
      }).catch(function(err){ //에러 처리
        console.log(err.message);
      });
    });
  },

  loadRealEstates: function() {
    //getAllBuyers 함수 불러올 것

    App.contracts.RealEstate.deployed().then(function(instance){
      return instance.getAllBuyers.call()
    }).then(function(buyers){
      for(i=0;i<buyers.length;i++){
        //해당 인덱스에 주소가 존재하면 팔린 것
        if(buyers[i]!=='0x0000000000000000000000000000000000000000'){
          var imgType=$('.panel-realEstate').eq(i).find('img').attr('src').substr(7);
          //매물 팔린 곳 템플릿을 찾아서(i) 그 매물의 img 이름만 가져옴
          //estate.json 에서 images/apart.jpg 이면 apart.jpg 가져옴
          
          switch(imgType){
            case 'apartment.jpg':
             $('.panel-realEstate').eq(i).find('img').attr('src','images/apartment_sold.jpg')
             break;
            case 'townhouse.jpg':
             $('.panel-realEstate').eq(i).find('img').attr('src','images/townhouse_sold.jpg')
             break;
            case 'house.jpg':
             $('.panel-realEstate').eq(i).find('img').attr('src','images/house_sold.jpg')
             break; 
          }

          $('.panel-realEstate').eq(i).find('.btn-buy').text('매각').attr('disabled',true);
          $('.panel-realEstate').eq(i).find('.btn-buyerInfo').removeAttr('style');
          //매각 버튼 비활성화
        }
      }
    }).catch(function(err){
      console.log(err.message);
    })
    },

  listenToEvents: function() {
    App.contracts.RealEstate.deployed().then(function(instance){
      instance.LogBuyRealEstate({},{fromBlock: 0,toBlock: 'latest'}).watch(function(error,event){
        //1. 필터링 - 디폴트(모든 이벤트 감지)
        //2. 범위 (처음부터 끝 블록까지)
        if(!error){
          $('#events').append('<p>'+event.args._buyer+' 계정에서 '+event.args._id+'번 매물을 매입했습니다'+'</p>')
        } else{
          console.error(error);
        }
        App.loadRealEstates();
      })
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  //매입버튼 클릭해서 modal이 띄워져있으면
  $('#buyModal').on('show.bs.modal',function(e){
    var id = $(e.relatedTarget).parent().find('.id').text(); //해당 템플릿 id필드 찾고 넣음
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0),"ether");
    //price string을 float타입으로 바꾼 후 ether로 변환

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);

  });

  $('#buyerInfoModal').on('show.bs.modal',function(e){
    var id = $(e.relatedTarget).parent().find('.id').text(); //해당 템플릿 id필드 찾고 넣음
    
    App.contracts.RealEstate.deployed().then(function(instance){
      return instance.getBuyerInfo.call(id);
    }).then(function(buyerInfo){
      //getBuyerInfo로 받은 데이터 modal로 전달
      $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]);
      $(e.currentTarget).find('#buyerName').text(web3.toUtf8(buyerInfo[1]));
      $(e.currentTarget).find('#buyerAge').text(buyerInfo[2]);
    }).catch(function(err){
      console.log(err.message);
    })
  });
});
