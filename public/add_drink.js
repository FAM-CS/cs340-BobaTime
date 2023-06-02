// Get the objects we need to modify
let addDrinkForm = document.getElementById('add-drink-form-ajax')

// Modify the objects we need
addDrinkForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputBaseFlavor = document.getElementById("input-base_flavor")
    let inputSmallPrice = document.getElementById("input-small_price")
    let inputRegPrice = document.getElementById("input-reg_price")
    let inputCanBeHot = document.getElementById("input-can_be_hot")
    let inputIsFlavoredSweetener = document.getElementById("input-is_flavored_sweetener")

    // Get the values from the form fields
    let baseFlavorValue = inputBaseFlavor.value
    let smallPriceValue = inputSmallPrice.value
    let regPriceValue = inputRegPrice.value
    let canBeHotValue = inputCanBeHot.value
    let isFlavoredSweetenerValue = inputIsFlavoredSweetener.value

    // Put our data we want to send in a javascript object
    let data = {
        base_flavor: baseFlavorValue,
        small_price: smallPriceValue,
        reg_price: regPriceValue,
        can_be_hot: canBeHotValue,
        is_flavored_sweetener: isFlavoredSweetenerValue
    }

    console.log("add data:", data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-drink-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // tell our ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add the new data to the table
            addDrinkRowToTable(xhttp.response)

            // clear the input fields for another transaction
            inputBaseFlavor = ''
            inputSmallPrice = ''
            inputRegPrice = ''
            inputCanBeHot = ''
            inputIsFlavoredSweetener = ''
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("there was an error with the input.")
        }
    }

    // send the request and wait for the response
    xhttp.send(JSON.stringify(data))
})


// Creates a single row from an Object representing a single record from
addDrinkRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drinks-table")
    
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length
    
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data)
    let newRow = parsedData[parsedData.length - 1]
    console.log("drink added:", parsedData)

    // Create a row and cells
    let row = document.createElement("TR")
    let deleteCell = document.createElement("TD")
    let idCell = document.createElement("TD")
    let baseFlavorCell = document.createElement("TD")
    let smallPriceCell = document.createElement("TD")
    let regPriceCell = document.createElement("TD")
    let canBeHotCell = document.createElement("TD")
    let isFlavoredSweetenerCell = document.createElement("TD")

    // Fill the cells with correct data
    deleteCell.innerHTML = '<button onclick="delete_drink(' + newRow.drink_id + ')">Delete</button>'
    idCell.innerText = newRow.drink_id
    baseFlavorCell.innerText = newRow.base_flavor
    smallPriceCell.innerText = newRow.small_price
    regPriceCell.innerText = newRow.reg_price
    canBeHotCell.innerText = newRow.can_be_hot
    isFlavoredSweetenerCell.innerText = newRow.is_flavored_sweetener

    // Add the cells to the row
    row.append(
          deleteCell
        , idCell
        , baseFlavorCell
        , smallPriceCell
        , regPriceCell
        , canBeHotCell
        , isFlavoredSweetenerCell)

    // Add the row to the table
    currentTable.appendChild(row)
}