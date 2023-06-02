// Get the objects we need to modify
let addAddOnForm = document.getElementById('add-addon-form-ajax')

// Modify the objects we need
addAddOnForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputTopping = document.getElementById("input-topping")
    let inputPrice = document.getElementById("input-price")

    // Get the values from the form fields
    let toppingValue = inputTopping.value
    let priceValue = inputPrice.value

    // Put our data we want to send in a javascript object
    let data = {
        topping: toppingValue,
        price: priceValue
    }

    console.log("add data:", data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-addon-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // tell our ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add the new data to the table
            addAddOnRowToTable(xhttp.response)

            // clear the input fields for another transaction
            inputTopping.value = ''
            inputPrice.value = ''
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("there was an error with the input.")
        }
    }

    // send the request and wait for the response
    xhttp.send(JSON.stringify(data))
})


// Creates a single row from an Object representing a single record from
addAddOnRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("addons-table")

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data)
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR")
    let deleteCell = document.createElement("TD")
    let idCell = document.createElement("TD")
    let toppingCell = document.createElement("TD")
    let priceCell = document.createElement("TD")

    // Fill the cells with correct data
    deleteCell.innerHTML = '<button onclick="delete_addon(' + newRow.add_on_id + ')">Delete</button>'
    idCell.innerText = newRow.add_on_id
    toppingCell.innerText = newRow.topping
    priceCell.innerText = newRow.price

    // Add the cells to the row
    row.append(
          deleteCell
        , idCell
        , toppingCell
        , priceCell)

    // Add the row to the table
    currentTable.appendChild(row)
}