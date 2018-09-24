function myFunction() {
    var totalMoney = 0;
    var max_index = document.getElementById('max_arr').value;
    console.log("max-index", max_index);

    
    console.log(parseInt(document.getElementById("myTable").rows[1].cells.item(2).innerHTML));
    for(var i = 0 ; i < max_index; i++) {
        var numberBuy = parseInt(document.getElementById('numberBuy'+i).value);
        var prices = parseInt(document.getElementById("myTable").rows[i+1].cells.item(2).innerHTML);
        console.log(prices);
        console.log(numberBuy);
        totalMoney += prices * numberBuy;
    }
    console.log("total" ,totalMoney);
    document.getElementById('totalPrices').value = totalMoney;
}

function delete_byOne(id) {
    console.log('Delete-byOne',id);
    $.get('/delete-by-one/'+id, {
        id: id
    }, (data) => {
        console.log("Da-ta-de-le-te",data.status);
        if(data.status) {
            window.location.href = '/shopping-cart';
        }
    }
    );
}

function removeAll(){
    $.get('/remove-all',(data) => {
        console.log(data.status);
        if(data.status) {
            window.location.href = '/shopping-cart';
        }
    });
}

function pay_cart() {
    var flag = false;
    var max_index = document.getElementById('max_arr').value;
    var arrBuy = [];
    console.log(max_index);
    var privateKey = document.getElementById('privateKey').value;

    for(var  i = 0; i < max_index; i++) {
        var numberBuy = document.getElementById('numberBuy'+i).value;
        var total = parseInt(document.getElementById("myTable").rows[i+1].cells.item(3).innerHTML);
        console.log('total', i,  total);
        if(validator.isInt(numberBuy, {min:1, max:parseInt(total)})) {
        } else {
            flag = true;
            return document.getElementById('hashError').innerHTML = "Number buy can't < 0 and > Total";
        }
    }
    console.log(privateKey == "");
    if(privateKey == "") {
        flag = true;
        document.getElementById('hashError').innerHTML = 'Private key not null';

    } else if(privateKey.length != 64) {
        console.log("privatekey",privateKey.length);
        flag = true;
        document.getElementById('hashError').innerHTML = 'Private key not true format';
    } else {
    }   

    if(flag == false) {
        for(var i = 0 ; i < max_index; i++) {
        var numberBuy = parseInt(document.getElementById('numberBuy'+i).value);
        var id = document.getElementById("myTable").rows[i+1].cells.item(0).innerHTML;
        var totalNumber =document.getElementById("myTable").rows[i+1].cells.item(3).innerHTML;
        var obj = {
            id: id,
            numberBuy: numberBuy,
            totalNumber: totalNumber
        }
        arrBuy.push(obj);
        }
        console.log(arrBuy);
        var totalMoney = parseInt(document.getElementById('totalPrices').value);
        console.log(totalMoney);

        $.post('/user/pay-cart', {
            arrBuy: JSON.stringify(arrBuy),
            totalMoney: totalMoney,
            privateKey: privateKey
          }, (data) => {
              if(data.status == false) {
                document.getElementById('hashError').innerHTML = 'Not enough money';
              } else {
                  if(data.hash) {
                      window.location.href = "/shopping-cart";
                  } 
                  if(data.mes) {
                    document.getElementById('hashError').innerHTML = data.mes;
                  }
              }
          });

    }


}