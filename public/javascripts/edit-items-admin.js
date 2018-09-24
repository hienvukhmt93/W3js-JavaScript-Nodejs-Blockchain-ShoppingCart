function edit(id) {
    // console.log(id);
    $.get('/admin/direct-edit/'+id, {
        id: id
    }, (data) => {
            console.log("Ok");
            window.location.href = '/admin/direct-edit/'+id;
    });
}