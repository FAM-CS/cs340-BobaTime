// ***********************************************************************
// Submitting / UI Logic
// ***********************************************************************
const drink_list = document.getElementById("add-drinks-list")
const add_drink_button = document.getElementById('add-new-drink')
const add_order_form = document.getElementById('add-order-form-ajax')
let ORDER_DATA = {}


const capture_order_data = () => {
    const data = {
        customer_id: null,
        order_date: null,
        num_drinks: null,
        drinkorders: [

        ],
        total_cost: 0
    }

    const id_value = document.getElementById('input-customer_id').value
    const date_value = document.getElementById('input-order_date').value
    const num_drinks_value = document.getElementById('input-num_drinks').value

    data["customer_id"] = id_value
    data["order_date"] = date_value
    data["num_drinks"] = num_drinks_value

    // iterate
    const drink_list_items = document.querySelectorAll("#add-drinks-list li.drink-item")
    console.log("drink_list_items", drink_list_items)

    drink_list_items.forEach((item, idx1) => {
        // console.log("item", item)
        // console.log("item.querySelector('.input-drink_id').value", item.querySelector('.input-drink_id').value)
        // console.log("item.querySelector('.input-amt_add_on').value", item.querySelector('.input-amt_add_on').value)
        // console.log("item.querySelector('.input-sweetness_lvl').value", item.querySelector('.input-sweetness_lvl').value)
        // console.log("item.querySelector('.input-drink_size').value", item.querySelector('.input-drink_size').value)
        // console.log("item.querySelector('.input-price').value", item.querySelector('.input-price').value)
        //
        const drink_order_obj = {
            toppings: []
        }

        let drink_id_value = item.querySelector('.input-drink_id').value
        let num_toppings_value = item.querySelector('.input-amt_add_on').value
        let sweetness_lvl_value = item.querySelector('.input-sweetness_lvl').value
        let drink_size_value = item.querySelector('.input-drink_size').value
        let price_value = item.querySelector('.input-price').value

        data["total_cost"] += parseFloat(price_value)
        drink_order_obj["drink_id"] = drink_id_value
        drink_order_obj["seq_number"] = idx1 + 1
        drink_order_obj["sweetness_lvl"] = parseInt(sweetness_lvl_value)
        drink_order_obj["is_cold"] = 1
        drink_order_obj["drink_size"] = drink_size_value

        let drink_addons = item.querySelectorAll(".drink-addons li")

        drink_addons.forEach((addon_item, idx2) => {
            // console.log("addon_item.querySelector('.input-add_on_id').options", addon_item.querySelector('.input-add_on_id').options)
            const addon_obj = {}
            //~ id and quantity
            let add_on_id_value = addon_item.querySelector('.input-add_on_id').value
            let quantity_value = addon_item.querySelector('.input-add_on_quantity').value
            addon_obj["add_on_id"] = add_on_id_value
            addon_obj["quantity"] = quantity_value
            //~ price
            let addon_options = addon_item.querySelector('.input-add_on_id').options
            let option_text = addon_options[addon_options.selectedIndex].textContent
            let price = option_text.substring(option_text.indexOf('$') + 1)
            data["total_cost"] += parseInt(quantity_value) * parseFloat(price)

            drink_order_obj["toppings"].push(addon_obj)
        })

        data["drinkorders"].push(drink_order_obj)
    })

    console.log("fin data:====", data)

    return data
}

add_order_form.addEventListener("change", (event) => {
    event.preventDefault()

    fetch("/api/order-drink", {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-type"
        }
    })
    .then((response) => response.json())
    .then((data) => {
        client_data = capture_order_data()

        let total_cost = document.getElementById("input-total_cost")
        if (isNaN(client_data["total_cost"])) {
            total_cost.innerText = "- -"
        } else {
            total_cost.innerText = Number((client_data["total_cost"]).toFixed(2))
            ORDER_DATA = client_data
        }
    })
    .catch(console.error)
})

const add_toppings = (event, data) => {
    const num_addons = parseInt(event.target.value)

    const new_addon_entry = Handlebars.templates.addons_entry(data)

    // Clear toppings list
    let current_addons_list = event.target.parentNode.querySelector(".drink-addons")
    current_addons_list.innerHTML = ""
    for (let i = 0; i < num_addons; i++) {
        current_addons_list.insertAdjacentHTML("beforeend", new_addon_entry)
    }
}


const refresh_addons_menu = () => {
    let number_addons_list = document.querySelectorAll(".input-amt_add_on")

    number_addons_list.forEach((item) => {
        item.addEventListener("change", (event) => {
            event.preventDefault()

            fetch("/api/order-drink", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-type"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                add_toppings(event, data)
            })
            .catch(console.error)
        })
    })
}
refresh_addons_menu()


const update_drink_price = (event, data) => {
    let target = event.target.parentNode.querySelector(".input-drink_id")

    let current_size = target.parentNode.querySelector(".input-drink_size").value
    const drink_id = parseInt(target.value)

    // update drink
    let curr_drink_price = target.parentNode.querySelector(".input-price")
    curr_drink_price.innerHTML = 0.0
    data["drinks"].forEach((item) => {
        if (item["Drink ID"] === drink_id) {
            if (current_size === "R") {
                curr_drink_price.innerHTML = item["Price (Regular)"]
            }
            else {
                curr_drink_price.innerHTML = item["Price (Small)"]
            }
        }
    })
}

const refresh_drink_price = () => {
    let drink_flavor_selects = document.querySelectorAll(".input-drink_id")
    let size_selects = document.querySelectorAll(".input-drink_size")

    drink_flavor_selects.forEach((item) => {
        item.addEventListener("change", (event) => {
            event.preventDefault()

            fetch("/api/order-drink", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-type"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                update_drink_price(event, data)
            })
            .catch(console.error)
        })
    })

    size_selects.forEach((item) => {
        item.addEventListener("change", (event) => {
            event.preventDefault()

            fetch("/api/order-drink", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-type"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                const curr_drink = event.target.parentNode.querySelector(".input-drink_id").value
                if (curr_drink !== "") {
                    update_drink_price(event, data)
                }
            })
            .catch(console.error)
        })
    })
}
refresh_drink_price()


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
            refresh_addons_menu()
            refresh_drink_price()
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

// Modify the objects we need
// Note: Ran into bug where any buttom in form is a submit event
add_order_button.addEventListener("click", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Data is in json object
    console.log("ORDER_DATA", ORDER_DATA)
    let data = ORDER_DATA

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-order-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "GET, POST, PUT, DELETE, OPTIONS")
    xhttp.setRequestHeader("Access-Control-Allow-Headers", "Content-type")

    // tell our ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // no longer doing anything, just redirect
            // add the new data to the table
            // addRowToTable(xhttp.response)

            // clear the input fields for another transaction
            // inputID.value = ''
            // inputDate.value = ''
            // inputNum.value = ''
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

    if (isNaN(num_drinks_value)) {
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


function update_row(data, order_id) {
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
            num_drinks_td.innerHTML = parsedData[i - 1].num_drinks
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
        success: function (result) {
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
