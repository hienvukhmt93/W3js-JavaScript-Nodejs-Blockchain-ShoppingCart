
function myFunction() {
    var flag = false;
    var proDuctId = document.getElementById('proDuctId').value;
    var prices = document.getElementById('prices').value;
    var name = document.getElementById('name').value;
    var totalNumber = document.getElementById('totalNumber').value;
    var address = document.getElementById('address').value;
    var number = document.getElementById('number').value;
    var privateKey = document.getElementById('privateKey').value;
    var hashCode = document.getElementById('hashCode').value;
    var description = document.getElementById('description').value;
    console.log(number);
    // console.log(number == "");
    
    if(number == "") {
      flag = true;
      document.getElementById('errorNumber').className = "alert alert-danger"
      document.getElementById('errorNumber').innerHTML  = "Number not null";
    } else {
      document.getElementById('errorNumber').innerHTML  = "";
      if(validator.isInt(number,{max:100, min:1}) ){
        document.getElementById('errorNumber').innerHTML  = "";
      } else {
        flag = true;
        document.getElementById('errorNumber').className = "alert alert-danger";
        document.getElementById('errorNumber').innerHTML  = "Is Number";
      }
    }
    if(privateKey == "") {
      flag = true;
      document.getElementById('errorPrivateKey').className = "alert alert-danger";
      document.getElementById('errorPrivateKey').innerHTML = "Private Key not null";
    }else if(privateKey.length != 64) {
      flag = true;
      console.log('privat', privateKey.length);
      document.getElementById('errorPrivateKey').className = "alert alert-danger";
      document.getElementById('errorPrivateKey').innerHTML = "Private key format not true";
    } 
      else {
      document.getElementById('errorPrivateKey').innerHTML = "";
     } 
    if(flag == false) {
      $.post('/user/buy-now', {
        proDuctId: proDuctId,
        prices: prices,
        name: name,
        totalNumber: totalNumber,
        address: address,
        privateKey: privateKey,
        hashCode: hashCode,
        description: description,
        number: number
      }, (data) => {
        console.log(data.hash);
        if(data.status) {
          document.getElementById('hashError').className = "alert alert-danger"
          document.getElementById('hashError').innerHTML = "Not money";
        } else {
          if(data.hash) {
            window.location.href = '/';
          } else {
            document.getElementById('hashError').className = "alert alert-danger"
            document.getElementById('hashError').innerHTML = data.mes;
          }
        }
      });
    }
}