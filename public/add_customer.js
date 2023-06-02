// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax')

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputEmail = document.getElementById("input-email")
    let inputPhoneNum = document.getElementById("input-phone_num")
    let inputFirstName = document.getElementById("input-first_name")
    let inputLastName = document.getElementById("input-last_name")

    // Get the values from the form fields
    let emailValue = inputEmail.value
    let phoneNumValue = inputPhoneNum.value
    let firstNameValue = inputFirstName.value
    let lastNameValue = inputLastName.value

    // Put our data we want to send in a javascript object
    let data = {
        email: emailValue,
        phone_num: phoneNumValue,
        first_name: firstNameValue,
        last_name: lastNameValue
    }
    // console.log("add data:", data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-customer-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // tell our ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add the new data to the table
            addRowToTable(xhttp.response)

            // clear the input fields for another transaction
            inputEmail.value = ''
            inputPhoneNum.value = ''
            inputFirstName.value = ''
            inputLastName.value = ''
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
    let currentTable = document.getElementById("customers-table")
    
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length
    
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data)
    let newRow = parsedData[parsedData.length - 1]
    // console.log("parsedData:", parsedData)

    // Create a row and cells
    let row = document.createElement("TR")
    let deleteCell = document.createElement("TD")
    let idCell = document.createElement("TD")
    let emailCell = document.createElement("TD")
    let phoneNumCell = document.createElement("TD")
    let firstNameCell = document.createElement("TD")
    let lastNameCell = document.createElement("TD")
    let numOrdersCell = document.createElement("TD")
    let numDrinksCell = document.createElement("TD")
    let totalSpentCell = document.createElement("TD")
    let drinksToFreeCell = document.createElement("TD")
    let numFreeDrinksCell = document.createElement("TD")

    // Fill the cells with correct data
    deleteCell.innerHTML = '<button onclick="delete_customer(' + newRow.customer_id + ')">Delete</button>'
    idCell.innerText = newRow.customer_id
    emailCell.innerText = newRow.email
    phoneNumCell.innerText = newRow.phone_num
    firstNameCell.innerText = newRow.first_name
    lastNameCell.innerText = newRow.last_name
    numOrdersCell.innerText = newRow.num_orders
    numDrinksCell.innerText = newRow.num_drinks
    totalSpentCell.innerText = newRow.total_spent
    drinksToFreeCell.innerText = newRow.drinks_to_free
    numFreeDrinksCell.innerText = newRow.num_free_drinks

    // Add the cells to the row
    row.appendChild(deleteCell)
    row.appendChild(idCell)
    row.appendChild(emailCell)
    row.appendChild(phoneNumCell)
    row.appendChild(firstNameCell)
    row.appendChild(lastNameCell)
    row.appendChild(numOrdersCell)
    row.appendChild(numDrinksCell)
    row.appendChild(totalSpentCell)
    row.appendChild(drinksToFreeCell)
    row.appendChild(numFreeDrinksCell)

    // Add the row to the table
    currentTable.appendChild(row)
}