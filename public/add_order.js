// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax')

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
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