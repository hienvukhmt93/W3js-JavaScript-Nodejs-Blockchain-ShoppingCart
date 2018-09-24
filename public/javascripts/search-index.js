var myobject = {
    search: function() {
       var  id =  document.getElementById('search').value ;
        console.log(id);
    } ,
    
    search_onkeyup: function() {
        var id = document.getElementById('search').value;
        console.log(id);
        var flag  = false;

        if(id == "") {
            flag = true;
        }

        if(flag == false) {
            $.get('/search/'+ id, {
                id: id
            },(data) => {
                window.location.href = "/search/"+id;
            }
            );
        }
    } 
}