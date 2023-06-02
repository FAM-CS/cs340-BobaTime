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