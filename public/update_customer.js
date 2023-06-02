let update_customer_form = document.getElementById('update-customer-form-ajax')

update_customer_form.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("input-customer_id")
    let inputPhoneNum = document.getElementById("update-phone_num")
    let inputFirstName = document.getElementById("update-first_name")
    let inputLastName = document.getElementById("update-last_name")
    
    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value
    let phoneNumValue = inputPhoneNum.value
    let firstNameValue = inputFirstName.value
    let lastNameValue = inputLastName.value

    // Put our data we want to send in a javascript object
    let data = {
        customer_id: customerIDValue,
        phone_num: phoneNumValue,
        first_name: firstNameValue,
        last_name: lastNameValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/put-customer-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            // console.log("res", xhttp.response.body)
            update_customer_row(xhttp.response, customerIDValue)
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))
})


function update_customer_row(data, customer_id){
    let parsedData = JSON.parse(data)
    console.log("parsedData", parsedData)

    let table = document.getElementById("customers-table")

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].cells[1].innerText == customer_id) {
             // Get the location of the row where we found the matching person ID
             let updateRowIndex = table.getElementsByTagName("tr")[i]
 
             let phone_num_td = updateRowIndex.getElementsByTagName("td")[3]
             let first_name_td = updateRowIndex.getElementsByTagName("td")[4]
             let last_name_td = updateRowIndex.getElementsByTagName("td")[5]

             phone_num_td.innerHTML = parsedData[i-1].phone_num
             first_name_td.innerHTML = parsedData[i-1].first_name
             last_name_td.innerHTML = parsedData[i-1].last_name
        }
    }
}