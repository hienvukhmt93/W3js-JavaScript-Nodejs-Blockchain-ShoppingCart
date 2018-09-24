function recharge_to_account() {
    flag = false;
    var amount = document.getElementById('amount').value;
    var email = document.getElementById('email').value;
    var privateKey = document.getElementById('privateKey').value;
    console.log(amount == "");
    if(amount == "") {
        flag = true;
        document.getElementById('hasError').innerHTML = "Amount not null";
        document.getElementById('hasError').className = "alert alert-danger";
    } else {
        if(validator.isInt(amount, {min: 1})) {
        } else {
            flag = true;
            document.getElementById('hasError').innerHTML = "Amout > 0";
            document.getElementById('hasError').className = "alert alert-danger";
        }
    }
  
    if(privateKey.length == 0) {
        flag = true;
        document.getElementById('hasError').innerHTML = "Private key not null";
        document.getElementById('hasError').className = "alert alert-danger";

    }  if(privateKey.length != 64 && privateKey.length > 0) {
        console.log("privatekey",privateKey.length);
        flag = true;
        document.getElementById('hasError').innerHTML = "Private key not true format";
    } 

    if(email == "") {
        flag = true;
        document.getElementById('hasError').innerHTML = "Email not null";
        document.getElementById('hasError').className = "alert alert-danger";
    } else {
        if(validator.isEmail(email)) {
        } else {
            flag = true;
            document.getElementById('hasError').innerHTML = "Email format not true";
            document.getElementById('hasError').className = "alert alert-danger";
        }
    }

    if(flag == false) {
        $.post('/admin/recharge-to-account', {
            email: email,
            amount: amount,
            privateKey: privateKey,
        }, (data) => {
            if(data.mes) {
                document.getElementById('hasError').innerHTML = data.mes;
                document.getElementById('hasError').className = "alert alert-danger";
            }
            if(data.status) {
                window.location.href = "/";
            }
        })
    }
}