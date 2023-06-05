//? Queries and sql logic is referenced from the lecture demo and the github resource:
//?  https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
 *   SETUP
 */

// Express and Handlebars
const express = require('express')
const hbrs_engine = require('express-handlebars')
const handlebars = require("handlebars");

const app = express()

app.engine('handlebars', hbrs_engine.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Database
// const mysql = require('mysql')
// const fs = require('fs')
const db = require('./database/db-connector')
const db_queries = require('./database/db-queries')


/*************************************************************************
 * Global Variables / Constants
 *************************************************************************/
var PORT_NUM = process.env.PORT || 54321
const local_URL = "http://localhost:"
const flip3_URL = "http://flip3.engr.oregonstate.edu:"

let options = [
    {
        option: "/menu"
        , option_name: "Menu"
        , active: false
    },
    {
        option: "/orders"
        , option_name: "Orders"
        , active: false
    },
    {
        option: "/customers"
        , option_name: "Customers"
        , active: false
    },
    {
        option: "/stats"
        , option_name: "Stats"
        , active: false
    }
]


/*
 * HANDLERBAR Helpers
 */

//? Source: https://stackoverflow.com/questions/34252817/handlebarsjs-check-if-a-string-is-equal-to-a-value
handlebars.registerHelper('if_equals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
})


/*************************************************************************
 * ROUTES
 *************************************************************************/

app.use((req, res, next) => {
    console.log("\n-- Request recieved --")
    console.log("Method: ", req.method)
    console.log("URL: ", req.url)
    console.log("----------------------")
    // console.log("Headers: ", req.headers)

    next()		// Go to next middleware/routing function
})


/**
 * Set option.active to true or false depending on whether the current route matches
 */
const set_active_option = (req, res, next) => {
    const current_route = req.path

    options.forEach((option) => {
        option.active = option.option === current_route
        if (option.option === "/stats" && current_route.startsWith("/stats/")) {
            option.active = true
        }
    })

    next()
}


// ? Get pages/static items in public folder (css, imgs, client JS)
app.use(express.static(__dirname + '/public'))


/*************************************************************************
 * ROUTES / GET
 *************************************************************************/

// ~ Home Page (Entry point for "GET /"")
app.get('/', set_active_option, (req, res) => {
    res.status(200).render('home', { options })
})


// ~ Menu
app.get('/menu', set_active_option, async (req, res) => {
    try {
        const drink_rows = await db_queries.select_all_clean("Drinks")
        const addon_rows = await db_queries.select_all_clean("AddOns")

        //? Combine header and row data, render() only accepts one object via Object.assign()
        //? from: https://www.delftstack.com/howto/javascript/javascript-append-to-object/#use-the-object.assign-method-to-append-elements-to-objects-in-javascript
        const data = Object.assign({options}, {drinks: drink_rows}, {addons: addon_rows})
        res.status(200).render('menu', data)
    }
    catch (error) {
        console.log("menu err:", error)
        res.status(500).render('500', {options})
    }
})


// ~ Order
app.get('/orders', set_active_option, async (req, res) => {
    try {
        const order_rows = await db_queries.select_all_clean("Orders")
        const drinkorder_rows = await db_queries.select_all_clean("DrinkOrders")
        const addondetail_rows = await db_queries.select_all_clean("AddOnDetails")
        const customer_rows = await db_queries.select_customer_names()

        const data = Object.assign(
              {options}
            , {orders: order_rows}
            , {drink_orders: drinkorder_rows}
            , {addon_details: addondetail_rows}
            , {customers: customer_rows}
            )
        console.log("data:", data)

        res.status(200).render('orders', data)
    }
    catch (error) {
        console.log("order err:", error)
        res.status(500).render('500', {options})
    }
})


// ~ Customers
app.get('/customers', set_active_option, async (req, res) => {
    try {
        const customer_rows = await db_queries.select_all_clean("Customers")

        const data = Object.assign(
              {options}
            , {customers: customer_rows}
            )
        console.log("data:", data)

        res.status(200).render('customers', data)
    }
    catch (error) {
        console.log("order err:", error)
        res.status(500).render('500', {options})
    }
})


// ~ See stats
app.get('/stats', set_active_option, async (req, res) => {
    try {
        const flavor_rows = await db_queries.stats_top_flavors()
        const topping_rows = await db_queries.stats_top_toppings()
        const drink_rows = await db_queries.stats_top_drinks()

        const data = Object.assign(
            {options}
            , {topflavors: flavor_rows}
            , {topaddons: topping_rows}
            , {topdrinks: drink_rows}
            )
        console.log("data:", data)

        res.status(200).render('stats_top', data)
    }
    catch (error) {
        console.log("order err:", error)
        res.status(500).render('500', {options})
    }
})


// ~ See stats
app.get('/stats/top', set_active_option, async (req, res) => {
    try {
        const flavor_rows = await db_queries.stats_top_flavors()
        const topping_rows = await db_queries.stats_top_toppings()
        const drink_rows = await db_queries.stats_top_drinks()

        const data = Object.assign(
            {options}
            , {topflavors: flavor_rows}
            , {topaddons: topping_rows}
            , {topdrinks: drink_rows}
            )
        console.log("data:", data)

        res.status(200).render('stats_top', data)
    }
    catch (error) {
        console.log("order err:", error)
        res.status(500).render('500', {options})
    }
})


/*
  ~ POST
*/

app.post('/add-order-ajax', async (req, res) => {
    try {
        // Capture the incoming data and parse it back to a JS object
        let req_data = await req.body;
        console.log("req_data:", req_data)

        // Create the query and run it on the database
        const table = "Orders"
        const columns = ["customer_id", "order_date", "num_drinks"]
        const parameters = [table, columns, [req_data.customer_id, req_data.order_date, req_data.num_drinks]]

        // Run query and wait on result (for orders we need formatted dates, use raw)
        const result = await db_queries.insert_values(parameters)
        const rows = await db_queries.select_all_raw('Orders')

        res.status(200).send(rows)
    }
    catch (error) {
        console.log("order err:", error)
        res.status(500).render('500', {options})
    }
})


app.post('/add-drink-ajax', async (req, res) => {
    try {
        // Capture the incoming data and parse it back to a JS object
        let data = await req.body;
        console.log("req_data:", data)

        // Create the query and run it on the database
        const table = "Drinks"
        const columns = ["base_flavor", "small_price", "reg_price", "can_be_hot", "is_flavored_sweetener"]
        const parameters = [table, columns, [data.base_flavor, data.small_price, data.reg_price, data.can_be_hot, data.is_flavored_sweetener]]

        // Run query and wait on result (for orders we need formatted dates, use raw)
        const result = await db_queries.insert_values(parameters)
        console.log(result)

        res.status(200).send(result)
    }
    catch (error) {
        console.log("drink err:", error)
        res.status(500).render('500', {options})
    }
})


app.post('/add-addon-ajax', async (req, res) => {
    try {
        // Capture the incoming data and parse it back to a JS object
        let data = await req.body;
        console.log("req_data:", data)

        // Create the query and run it on the database
        const table = "AddOns"
        const columns = ["topping", "price"]
        const parameters = [table, columns, [data.topping, data.price]]

        // Run query and wait on result (for orders we need formatted dates, use raw)
        const result = await db_queries.insert_values(parameters)
        console.log(result)

        res.status(200).send(result)
    }
    catch (error) {
        console.log("addon err:", error)
        res.status(500).render('500', {options})
    }
})


app.post('/add-customer-ajax', async (req, res) => {
    try {
        // Capture the incoming data and parse it back to a JS object
        let data = await req.body;
        console.log("req_data:", data)

        if (data.phone_num == '') {
            data.phone_num = 'NULL'
        }

        // Create the query and run it on the database
        const table = "Customers"
        const columns = ["email", "phone_num", "first_name", "last_name"]
        const parameters = [table, columns, [data.email, data.phone_num, data.first_name, data.last_name]]

        // Run query and wait on result (for orders we need formatted dates, use raw)
        const result = await db_queries.insert_values(parameters)
        console.log(result)

        res.status(200).send(result)
    }
    catch (error) {
        console.log("customer err:", error)
        res.status(500).render('500', {options})
    }
})

/*
  ~ DELETE
*/

app.delete('/delete-order-ajax/', async (req, res, next) => {
    try {
        // Capture the incoming data and parse it back to a JS object
        let data = await req.body;
        console.log("req_data:", data)

        // Create the query and run it on the database
        const table = "Orders"
        const id_name = "order_id"
        const id_value = parseInt(data[id_name])
        const parameters = [table, id_name, id_value]

        // Run query and wait on result (for orders we need formatted dates, use raw)
        const result = await db_queries.delete_row(parameters)
        console.log(result)
        res.sendStatus(204)
    }
    catch (error) {
        console.log("order err:", error)
        res.sendStatus(500)
    }
})


app.delete('/delete-drink-ajax/', async (req, res, next) => {
    try {
        // Capture the incoming data and parse it back to a JS object
        let data = await req.body;

        // Create the query and run it on the database
        const table = "Drinks"
        const id_name = "drink_id"
        const id_value = parseInt(data[id_name])
        const parameters = [table, id_name, id_value]

        // Run query and wait on result (for orders we need formatted dates, use raw)
        const result = await db_queries.delete_row(parameters)
        console.log(result)
        res.sendStatus(204)
    }
    catch (error) {
        console.log("drink err:", error)
        res.sendStatus(500)
    }
})


app.delete('/delete-addon-ajax/', async (req, res, next) => {
    try {
        // Capture the incoming data and parse it back to a JS object
        let data = await req.body;

        // Create the query and run it on the database
        const table = "AddOns"
        const id_name = "add_on_id"
        const id_value = parseInt(data[id_name])
        const parameters = [table, id_name, id_value]

        // Run query and wait on result (for orders we need formatted dates, use raw)
        const result = await db_queries.delete_row(parameters)
        console.log(result)
        res.sendStatus(204)
    }
    catch (error) {
        console.log("addon err:", error)
        res.sendStatus(500)
    }
})


app.delete('/delete-customer-ajax/', async (req, res, next) => {
    try {
        // Capture the incoming data and parse it back to a JS object
        let data = await req.body;

        // Create the query and run it on the database
        const table = "Customers"
        const id_name = "customer_id"
        const id_value = parseInt(data[id_name])
        const parameters = [table, id_name, id_value]

        // Run query and wait on result (for orders we need formatted dates, use raw)
        const result = await db_queries.delete_row(parameters)
        console.log(result)
        res.sendStatus(204)
    }
    catch (error) {
        console.log("customer err:", error)
        res.sendStatus(500)
    }
})

/*
  ~ PUT
*/

app.put('/put-order-ajax', function(req,res,next){
    let data = req.body
    console.log("data:", data)
    let order_id = parseInt(data.order_id)
    let num_drinks = parseInt(data.num_drinks)

    let query_update_numdrinks =
        `UPDATE Orders
        SET
            num_drinks = ?
        WHERE order_id = ?`

    // Run the 1st query
    db.pool.query(query_update_numdrinks, [num_drinks, order_id], function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400)
        } else {
            query2 = `
                SELECT
                    order_id
                    , customer_id
                    , DATE_FORMAT(order_date, '%Y-%m-%d %r') as order_date
                    , num_drinks
                    , total_cost
                FROM Orders
                `

            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.status(200).send(rows)
                }
            })
        }
    })
})

app.put('/put-drink-ajax', function(req,res,next){
    let data = req.body
    console.log("data:", data)

    const drink_id = parseInt(data.drink_id)
    const small_price = parseFloat(data.small_price)
    const reg_price = parseFloat(data.reg_price)
    const can_be_hot = parseInt(data.can_be_hot)
    const is_flavored_sweetener = parseInt(data.is_flavored_sweetener)

    const query_update_drink =
        `UPDATE Drinks
        SET
              base_flavor = ?
            , small_price = ?
            , reg_price = ?
            , can_be_hot = ?
            , is_flavored_sweetener = ?
        WHERE drink_id = ?;`

    const query_vals = [data.base_flavor, small_price, reg_price, can_be_hot, is_flavored_sweetener, drink_id]

    // Run the 1st query
    db.pool.query(query_update_drink, query_vals, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400)
        } else {
            query2 =`
                SELECT
                    *
                FROM Drinks
                `

            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.status(200).send(rows)
                }
            })
        }
    })
})

app.put('/put-addon-ajax', function(req,res,next){
    let data = req.body
    console.log("data:", data)

    let add_on_id = parseInt(data.add_on_id)
    let price = parseFloat(data.price)

    const query_update_addon = `
        UPDATE AddOns
        SET
            topping = ?
            , price = ?
        WHERE add_on_id = ?;`

    const query_vals = [data.topping, price, add_on_id]

    // Run the 1st query
    db.pool.query(query_update_addon, query_vals, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400)
        } else {
            query2 = `
                SELECT
                    *
                FROM AddOns
                `

            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.status(200).send(rows)
                }
            })
        }
    })
})


app.put('/put-customer-ajax', function(req,res,next){
    let data = req.body
    console.log("data:", data)

    let customer_id = parseInt(data.customer_id)
    let phone_num = parseInt(data.phone_num)

    const query_update_customer = `
        UPDATE Customers
        SET
            phone_num = ?
            , first_name = ?
            , last_name = ?
        WHERE customer_id = ?;`

    const query_vals = [data.phone_num, data.first_name, data.last_name, customer_id]

    // Run the 1st query
    db.pool.query(query_update_customer, query_vals, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400)
        } else {
            query2 = `
                SELECT
                    *
                FROM Customers
                `

            db.pool.query(query2, function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.status(200).send(rows)
                }
            })
        }
    })
})


// ***********************************************************************
// ! 404 Error
// ***********************************************************************
app.get('*', set_active_option, (req, res) => {
    res.status(404).render('404', {options})
})


/*
 * LISTENER
 */

app.listen(PORT_NUM, () => {
    console.log("\n----------------- Startup... -----------------\n")
    console.log("- App is running! 🍵")
    console.log("- Local: %s%d/", local_URL, PORT_NUM)
    console.log("- Flip: %s%d/", flip3_URL,PORT_NUM)
    console.log("\n-------------------- Logs --------------------")
})
