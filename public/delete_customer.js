delete_customer = (customer_id_given) => {
    let link = '/delete-customer-ajax'
    let data = {
        customer_id: customer_id_given
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
        delete_customer_row(customer_id_given)
        }
    })
}

delete_customer_row = (customer_id) => {
    let table = document.getElementById("customers-table")
    for (let i = 0, row; row = table.rows[i]; i++) {
        // console.log("ATT:", table.rows[i].cells[1].innerText)
        if (table.rows[i].cells[1].innerText == customer_id) {
                table.deleteRow(i)
                break
        }
    }
}