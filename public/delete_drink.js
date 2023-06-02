delete_drink = (drink_id_given) => {
    let link = '/delete-drink-ajax'
    let data = {
        drink_id: drink_id_given
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
        delete_drink_row(drink_id_given)
        }
    })
}

delete_drink_row = (drink_id) => {
    let table = document.getElementById("drinks-table")
    for (let i = 0, row; row = table.rows[i]; i++) {
        console.log("ATT:", table.rows[i].cells[1].innerText)
        if (table.rows[i].cells[1].innerText == drink_id) {
                table.deleteRow(i)
                break
        }
    }
}