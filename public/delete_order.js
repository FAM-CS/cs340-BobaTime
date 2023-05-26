delete_order = (order_id_given) => {
    let link = '/delete-order-ajax'
    let data = {
        order_id: order_id_given
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
        delete_row(order_id_given)
        }
    })
}


delete_row = (order_id) => {
    let table = document.getElementById("orders-table")
    for (let i = 0, row; row = table.rows[i]; i++) {
        // console.log("ATT:", table.rows[i].cells[1].innerText)
        if (table.rows[i].cells[1].innerText == order_id) {
                table.deleteRow(i)
                break
        }
    }
}