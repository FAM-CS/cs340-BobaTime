let update_drink_form = document.getElementById('update-drink-form-ajax')

update_drink_form.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputDrinkID = document.getElementById("input-drink_id")
    let inputBaseFlavor = document.getElementById("update-base_flavor")
    let inputSmallPrice = document.getElementById("update-small_price")
    let inputRegPrice = document.getElementById("update-reg_price")
    let inputCanBeHot = document.getElementById("update-can_be_hot")
    let inputIsFlavoredSweetener = document.getElementById("update-is_flavored_sweetener")

    // Get the values from the form fields
    let drinkIDValue = inputDrinkID.value
    let baseFlavorValue = inputBaseFlavor.value
    let smallPriceValue = inputSmallPrice.value
    let regPriceValue = inputRegPrice.value
    let canBeHotValue = inputCanBeHot.value
    let isFlavoredSweetenerValue = inputIsFlavoredSweetener.value

    // Put our data we want to send in a javascript object
    let data = {
        drink_id: drinkIDValue,
        base_flavor: baseFlavorValue,
        small_price: smallPriceValue,
        reg_price: regPriceValue,
        can_be_hot: canBeHotValue,
        is_flavored_sweetener: isFlavoredSweetenerValue
    }
    console.log("dataupdate:", data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/put-drink-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            // console.log("res", xhttp.response.body)
            update_drink_row(xhttp.response, drinkIDValue)
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))
})


function update_drink_row(data, drink_id){
    let parsedData = JSON.parse(data)

    let table = document.getElementById("drinks-table")

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].cells[1].innerText == drink_id) {
             // Get the location of the row where we found the matching person ID
             let updateRowIndex = table.getElementsByTagName("tr")[i]
 
             let base_flavor_td = updateRowIndex.getElementsByTagName("td")[2]
             let small_price_td = updateRowIndex.getElementsByTagName("td")[3]
             let reg_price_td = updateRowIndex.getElementsByTagName("td")[4]
             let can_be_hot_td = updateRowIndex.getElementsByTagName("td")[5]
             let is_flavored_sweetener_td = updateRowIndex.getElementsByTagName("td")[6]
 
             base_flavor_td.innerHTML = parsedData[i-1].base_flavor
             small_price_td.innerHTML = parsedData[i-1].small_price
             reg_price_td.innerHTML = parsedData[i-1].reg_price
             can_be_hot_td.innerHTML = parsedData[i-1].can_be_hot
             is_flavored_sweetener_td.innerHTML = parsedData[i-1].is_flavored_sweetener
        }
    }
}