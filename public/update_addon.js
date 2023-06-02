let update_addon_form = document.getElementById('update-addon-form-ajax')

update_addon_form.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputAddOnID = document.getElementById("input-add_on_id")
    let inputTopping = document.getElementById("update-input-topping")
    let inputPrice = document.getElementById("update-input-price")
    
    // Get the values from the form fields
    let addOnIDValue = inputAddOnID.value
    let toppingValue = inputTopping.value
    let priceValue = inputPrice.value

    // Put our data we want to send in a javascript object
    let data = {
        add_on_id: addOnIDValue,
        topping: toppingValue,
        price: priceValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/put-addon-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            // console.log("res", xhttp.response.body)
            update_addon_row(xhttp.response, addOnIDValue)
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))
})


function update_addon_row(data, add_on_id){
    let parsedData = JSON.parse(data)
    console.log("parsedData", parsedData)

    let table = document.getElementById("addons-table")

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].cells[1].innerText == add_on_id) {
             // Get the location of the row where we found the matching person ID
             let updateRowIndex = table.getElementsByTagName("tr")[i]
 
             let topping_td = updateRowIndex.getElementsByTagName("td")[2]
             let price_td = updateRowIndex.getElementsByTagName("td")[3]

             topping_td.innerHTML = parsedData[i-1].topping
             price_td.innerHTML = parsedData[i-1].price
        }
    }
}