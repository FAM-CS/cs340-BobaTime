// ***********************************************************************
// Submitting / UI Logic
// ***********************************************************************
const drink_list = document.getElementById("add-drinks-list")
const add_drink_button = document.getElementById('add-new-drink')

/**
 * Remove drink entry forms
 * Source: https://stackoverflow.com/questions/50524683/delete-specific-list-item-from-unordered-list-when-delete-button-is-clicked
 */
const refresh_drink_remove = () => {
    let remove_drink_buttons = document.querySelectorAll(".remove-drink")

    remove_drink_buttons.forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault()
            event.target.parentNode.remove()

            const drink_list_item = drink_list.getElementsByTagName("li")
            let drink_number = document.getElementById("input-num_drinks")
            drink_number.value = drink_list_item.length
        })
    })
}
refresh_drink_remove()


/**
 * Add new drinks forms if button is clicked
 */
add_drink_button.addEventListener("click", (event) => {
    // Prevent default post request with form body
    event.preventDefault()

    // Setup AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("GET", "/api/order-drink", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // Tell request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            add_new_drink_entry(xhttp.response)
            refresh_drink_remove()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error for getting drink/topping data.")
        }
    }

    // Send the request and wait for the response
    xhttp.send()
})


/**
 * Append new drink form and increment number of drinks in order
 * @param {JSON} data
 */
const add_new_drink_entry = (data) => {
    // console.log("data:", data)
    let parsed_data = JSON.parse(data)
    const new_drink_item = Handlebars.templates.drink_entry(parsed_data)

    let drink_list = document.getElementById("add-drinks-list")
    drink_list.insertAdjacentHTML("beforeend", new_drink_item)

    const drink_list_item = drink_list.getElementsByTagName("li")
    let drink_number = document.getElementById("input-num_drinks")
    drink_number.value = drink_list_item.length
}


// ***********************************************************************
// Add / submit order
// ***********************************************************************

// Get the objects we need to modify
let add_order_button = document.getElementById('submit-order')
// let addOrderForm = document.getElementById('add-order-form-ajax')

// Modify the objects we need
// Note: Ran into bug where any buttom in form is a submit event
add_order_button.addEventListener("click", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputID = document.getElementById("input-customer_id")
    let inputDate = document.getElementById("input-order_date")
    let inputNum = document.getElementById("input-num_drinks")

    // Get the values from the form fields
    let idValue = inputID.value
    let dateValue = inputDate.value
    let numValue = inputNum.value

    // Put our data we want to send in a javascript object
    let data = {
        customer_id: idValue,
        order_date: dateValue,
        num_drinks: numValue,
    }

    console.log("add data:", data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-order-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")


    // tell our ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add the new data to the table
            addRowToTable(xhttp.response)

            // clear the input fields for another transaction
            inputID.value = ''
            inputDate.value = ''
            inputNum.value = ''
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("there was an error with the input.")
        }
    }

    // send the request and wait for the response
    xhttp.send(JSON.stringify(data))
})


// Creates a single row from an Object representing a single record from
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("orders-table")

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data)
    console.log("parsedData", parsedData)
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR")
    let deleteCell = document.createElement("TD")
    let idCell = document.createElement("TD")
    let cIDCell = document.createElement("TD")
    let dateCell = document.createElement("TD")
    let numCell = document.createElement("TD")
    let tCostCell = document.createElement("TD")

    // Fill the cells with correct data
    deleteCell.innerHTML = '<button onclick="delete_order(' + newRow.order_id + ')">Delete</button>'
    idCell.innerText = newRow.order_id
    cIDCell.innerText = newRow.customer_id
    dateCell.innerText = newRow.order_date
    numCell.innerText = newRow.num_drinks
    tCostCell.innerText = newRow.total_cost

    // Add the cells to the row
    row.append(
          deleteCell
        , idCell
        , cIDCell
        , dateCell
        , numCell
        , tCostCell)

    // Add the row to the table
    currentTable.appendChild(row)
}


// ***********************************************************************
// Update
// ***********************************************************************
let update_order_form = document.getElementById('update-order-form-ajax')

update_order_form.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let input_order_id = document.getElementById("input-order_id")
    let input_num_drinks = document.getElementById("update-input-num_drinks")

    // Get the values from the form fields
    let order_id_value = input_order_id.value
    let num_drinks_value = input_num_drinks.value

    if (isNaN(num_drinks_value))
    {
        return
    }

    // Put our data we want to send in a javascript object
    let data = {
        order_id: order_id_value,
        num_drinks: num_drinks_value
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/put-order-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            // console.log("res", xhttp.response.body)
            update_row(xhttp.response, order_id_value)
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))
})


function update_row(data, order_id){
    let parsedData = JSON.parse(data)
    console.log("parsedData", parsedData)

    let table = document.getElementById("orders-table")

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].cells[1].innerText == order_id) {
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i]

            // Get td of num_drinks value
            let num_drinks_td = updateRowIndex.getElementsByTagName("td")[4]

            // Reassign num_drinks to our value we updated to
            num_drinks_td.innerHTML = parsedData[i-1].num_drinks
       }
    }
}


// ***********************************************************************
// Delete
// ***********************************************************************

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
