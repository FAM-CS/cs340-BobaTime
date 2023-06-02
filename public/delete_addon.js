delete_addon = (add_on_id_given) => {
    let link = '/delete-addon-ajax'
    let data = {
        add_on_id: add_on_id_given
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
        delete_addon_row(add_on_id_given)
        }
    })
}

delete_addon_row = (add_on_id) => {
    let table = document.getElementById("addons-table")
    for (let i = 0, row; row = table.rows[i]; i++) {
        console.log("ATT:", table.rows[i].cells[1].innerText)
        if (table.rows[i].cells[1].innerText == add_on_id) {
                table.deleteRow(i)
                break
        }
    }
}