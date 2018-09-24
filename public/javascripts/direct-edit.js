function progressHandler(event) {
        if(event.error) {
            document.getElementById('status').innerHTML = "Error upload";
        } else {
            if (event.lengthComputable) {
                var percentage = (event.loaded / event.total) * 100;
                console.log(percentage + "%");
                document.getElementById('upload').innerHTML = "Running ... " +percentage + "%";
            }
        }
}


function edit() {
    var file = document.getElementById('filename').files[0];
    console.log(file);
    console.log(file == undefined);
    var id = document.getElementById('_id').innerHTML;
    var name = document.getElementById('name').value;
    var prices = document.getElementById('prices').value;
    var description = document.getElementById('description').value;
    var number = document.getElementById('number').value;
    var detail = document.getElementById('detail').value;
    var privateKey = document.getElementById('privateKey').value;
    var flag = false;


    // console.log(id, name, prices, description, number, detail);alert alert-danger
    if(privateKey.length != 64) {
        flag = true;  
        document.getElementById('hashError').className = "alert alert-danger";
        document.getElementById('hashError').innerHTML = "Private key format not true";
    } 

    if(file == undefined) {
        flag = true;
        document.getElementById('hashError').innerHTML = "File not null";
        document.getElementById('hashError').className = "alert alert-danger";
    } else {
        if(file.size == 0) {
            flag = true;
            document.getElementById('hashError').className = "alert alert-danger";
            document.getElementById('hashError').innerHTML = "File not null";
        } else if(file.size > 4702116) {
            flag = true;
            document.getElementById('hashError').className = "alert alert-danger";
            document.getElementById('hashError').innerHTML = "File very  big";
        }
    }

    if(name == "") {
        flag = true;
        document.getElementById('hashError').innerHTML = "Name not null";
        document.getElementById('hashError').className = "alert alert-danger";
    }

    if(prices == "") {
        flag = true;
        document.getElementById('hashError').innerHTML = "Prices not null";
        document.getElementById('hashError').className = "alert alert-danger";
    } else {
        if(validator.isInt(prices,{min: 0})) {

        } else {
            flag = true;
            document.getElementById('hashError').innerHTML = "Prices can\'t < 0";
            document.getElementById('hashError').className = "alert alert-danger";
        }
    }

    if(description == "") {
        flag = true;
        document.getElementById('hashError').innerHTML = "Description not null";
        document.getElementById('hashError').className = "alert alert-danger";
    }
    
    if(number == "") {
        flag = true;
        document.getElementById('hashError').innerHTML = "Number not null";
        document.getElementById('hashError').className = "alert alert-danger";
    } else {
        if(validator.isInt(number,{min:1})) {

        } else {
            flag = true;
            document.getElementById('hashError').innerHTML = "Number can\'t < 1";
            document.getElementById('hashError').className = "alert alert-danger";
        }
    }

    if(detail == "") {
        flag = true;
        document.getElementById('hashError').innerHTML = "Detail not null";
        document.getElementById('hashError').className = "alert alert-danger";
    }

    if(flag == false) {
        document.getElementById('hashError').innerHTML = "";
        var formData = new FormData();
        formData.append('myFile', file);
        var data  = {
            id: id,
            name: name,
            prices: prices,
            description: description,
            number: number,
            detail: detail,
            privateKey: privateKey
        }
        formData.append('data',JSON.stringify(data) );
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/admin/direct-edit', true);
        xhr.upload.addEventListener('progress', progressHandler, true);
        xhr.send(formData);
        xhr.onloadend = function(e) {
            var data = JSON.parse(this.response);
            console.log(data.status);
            if(data.status) {
                window.location.href = "/admin/home-admin";
            } 
            if(data.mes) {
                document.getElementById('hashError'). innerHTML = data.mes;
            }
        }
    }
}