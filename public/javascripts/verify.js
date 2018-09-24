function verify() {
    var hash = document.getElementById('hash').value;
    var v = document.getElementById('v').value;
    var r = document.getElementById('r').value;
    var s = document.getElementById('s').value;
    var address = document.getElementById('address').innerHTML;
    var flag = false;

    console.log(hash.length, v, r.length , s.length, address);
    if(v == "") {
        document.getElementById('hashError').innerHTML = "V not null";
        flag = true;
    } else {
        if(validator.isInt(v)) {
        } else {
            document.getElementById('hashError').innerHTML = "V Is number";
            flag = true;
        }
    }

    if(r.length != 66) {
        document.getElementById('hashError').innerHTML = "R format not true";
        flag = true;
    }
    
    if(hash.length != 66) {
        document.getElementById('hashError').innerHTML = "Hash format not true";
        flag = true;
    } 

    if(s.length != 66) {
        document.getElementById('hashError').innerHTML = "S format not true";
        flag = true;
    } 

    if(flag == false) {
        document.getElementById('hashError').innerHTML = "";
        $.post('/user/verify', {
            address: address,
            hash: hash,
            v: v,
            r: r,
            s: s
        }, (data) => {
            if(data.result) {
                document.getElementById('hashError').innerHTML = data.result;
            } else {
                document.getElementById('hashError').innerHTML = data.result;
            }
        });
    }
}