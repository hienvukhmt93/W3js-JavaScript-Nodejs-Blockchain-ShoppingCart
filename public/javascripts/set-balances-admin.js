 function approve(email, amount, index) {
    var _id = document.getElementById('_id'+index).innerHTML;
    var email = document.getElementById('email'+index).innerHTML;
    var amount = document.getElementById('amount'+index).innerHTML;
    var privateKey = document.getElementById('privateKey'+index).value;
    console.log(email, amount, privateKey);
    flag = false;

    if(privateKey == "") {
        document.getElementById('hashError').className = "alert alert-danger";
        document.getElementById('hashError').innerHTML = "Private key not null";
        flag = true;
    } else {
        if(privateKey.length != 64) {
            flag = true;
            document.getElementById('hashError').className = "alert alert-danger";
            document.getElementById('hashError').innerHTML = "Private key format not true";
        } else {
            document.getElementById('hashError').innerHTML = "";
        }
    } 

    if(flag == false) {
        $.post('/admin/set-balances',{
            _id: _id,
            email: email,
            amount: amount,
            privateKey: privateKey
        }, (data) => {
            if(data.mes) {
                document.getElementById('hashError').className = "alert alert-danger";
                document.getElementById('hashError').innerHTML = data.mes;
            }
            if(data.status) {
                window.location.href = '/admin//set-balances';
            }
        });
    }
}