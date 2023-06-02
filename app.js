//? Queries and sql logic is referenced from the lecture demo and the github resource:
//?  https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/

const express = require('express')
const hbrs_engine = require('express-handlebars')
const handlebars = require("handlebars");

const app = express()
var PORT_NUM = process.env.PORT || 54321

app.engine('handlebars', hbrs_engine.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const mysql = require('mysql')
const fs = require('fs')
const db = require('./database/db-connector')

/*
  HANDLERBAR Helpers
*/

//? Source: https://stackoverflow.com/questions/34252817/handlebarsjs-check-if-a-string-is-equal-to-a-value
handlebars.registerHelper('if_equals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
})

/*
    ROUTES
*/

const local_URL = "http://localhost:"
const flip3_URL = "http://flip3.engr.oregonstate.edu:"

app.listen(PORT_NUM, () => {
    console.log("\n----------------- Startup... -----------------\n")
    console.log("- App is running! 🍵")
    console.log("- Local: %s%d/", local_URL, PORT_NUM)
    console.log("- Flip: %s%d/", flip3_URL,PORT_NUM)
    console.log("\n-------------------- Logs --------------------")
})

app.use((req, res, next) => {
    console.log("\n-- Request recieved --")
    console.log("Method: ", req.method)
    console.log("URL: ", req.url)
    console.log("----------------------")
    // console.log("Headers: ", req.headers)

    next()		// Go to next middleware/routing function
})



// ~ Home Page (Entry point for "GET /"")
app.get('/', (req, res) => {
    const options = [
        {
            option: "menu"
            , option_name: "Menu"
            , active: false
        },
        {
            option: "orders"
            , option_name: "Orders"
            , active: false
        },
        {
            option: "customers"
            , option_name: "Customers"
            , active: false
        },
        {
            option: "stats"
            , option_name: "Stats"
            , active: false
        }
    ]

    res.status(200).render('home', { options })
})


// ! Must come after main entry
// ? Get pages/static items in public folder (css, imgs, client JS)
app.use(express.static(__dirname + '/public'))


// ~ Menu
app.get('/menu', (req, res) => {
    const options = [
        {
          option: "menu"
        , option_name: "Menu"
        , active: true
        },
        {
             option: "orders"
            , option_name: "Orders"
            , active: false
        },
        {
            option: "customers"
            , option_name: "Customers"
            , active: false
        },
        {
            option: "stats"
            , option_name: "Stats"
            , active: false
        }
    ]

    const query1 = "SELECT * FROM Drinks";
    const query2 = "SELECT * FROM AddOns";
    db.pool.query(query1, (error1, rows1, fields) => {
        db.pool.query(query2, (error2, rows2, fields) => {
            //? Combine header and row data, render() only accepts one object via Object.assign()
            //? from: https://www.delftstack.com/howto/javascript/javascript-append-to-object/#use-the-object.assign-method-to-append-elements-to-objects-in-javascript
            const data = Object.assign({options}, {drinks: rows1}, {addons: rows2})
            console.log("data:", data)

            if (error1 || error2) {
                console.log("error1:", error1)
                console.log("error2:", error2)
                next()  // something wrong occured, go next middleware
                return
            }

            res.status(200).render('menu', data)
        })
    })
})


// ~ Order
app.get('/orders', (req, res) => {
    const options = [
        {
          option: "menu"
        , option_name: "Menu"
        , active: false
        },
        {
             option: "orders"
            , option_name: "Orders"
            , active: true
        },
        {
            option: "customers"
            , option_name: "Customers"
            , active: false
        },
        {
            option: "stats"
            , option_name: "Stats"
            , active: false
        }
    ]

    const query1 =
        `SELECT order_id
        , customer_id
        , DATE_FORMAT(order_date, '%Y-%m-%d %r') as order_date
        , num_drinks
        , total_cost FROM Orders`

    const query2 = "SELECT * FROM DrinkOrders"
    const query3 = "SELECT * FROM AddOnDetails"
    const query4 =
        `SELECT
          customer_id
        , CONCAT(first_name, " ", last_name) AS \`Full Name\`
        FROM Customers`

    db.pool.query(query1, (error1, rows1, fields) => {
        db.pool.query(query2, (error2, rows2, fields) => {
            db.pool.query(query3, (error3, rows3, fields) => {
                db.pool.query(query4, (error4, rows4, fields) => {
                    const data = Object.assign(
                          {options}
                        , {orders: rows1}
                        , {drink_orders: rows2}
                        , {addon_details: rows3}
                        , {customers: rows4}
                    )
                    console.log("data:", data)

                    if (error1 || error2 || error3 || error4){
                        console.log("error1:", error1)
                        console.log("error2:", error2)
                        console.log("error3:", error3)
                        console.log("error4:", error4)
                        next()
                        return
                    }

                    res.status(200).render('orders', data)
                })
            })
        })
    })
})


// ~ Customers
app.get('/customers', (req, res) => {
    const options = [
        {
          option: "menu"
        , option_name: "Menu"
        , active: false
        },
        {
             option: "orders"
            , option_name: "Orders"
            , active: false
        },
        {
            option: "customers"
            , option_name: "Customers"
            , active: true
        },
        {
            option: "stats"
            , option_name: "Stats"
            , active: false
        }
    ]


    const query = "SELECT * FROM Customers";
    db.pool.query(query, (error, rows, fields) => {
        const data = Object.assign({options}, {data: rows})

        if (error) {
            console.log("error:", error)
            next()  // something wrong occured, go next middleware
            return
        }

        res.status(200).render('customers', data)
    })
})


// ~ See stats
app.get('/stats', (req, res) => {
    const options = [
        {
          option: "menu"
        , option_name: "Menu"
        , active: false
        },
        {
             option: "orders"
            , option_name: "Orders"
            , active: false
        },
        {
            option: "customers"
            , option_name: "Customers"
            , active: false
        },
        {
            option: "stats"
            , option_name: "Stats"
            , active: true
        }
    ]

    const query1 = `
        SELECT
            base_flavor AS \`Flavor\`
            , COUNT(DO.drink_order_id) AS \`Times Ordered\`
        FROM
            Drinks D LEFT JOIN DrinkOrders DO on D.drink_id = DO.drink_id
        GROUP BY
            base_flavor
        ORDER BY
            \`Times Ordered\` DESC`

    const query2 = `
        SELECT
            topping AS "Topping"
        , IF(SUM(AD.quantity) IS NULL, 0, SUM(AD.quantity)) AS "Times Added"
        FROM
            AddOns A LEFT JOIN AddOnDetails AD ON A.add_on_id = AD.add_on_id
        GROUP BY
            topping
        ORDER BY
            \`Times Added\` DESC;`

    const query3 = `
        SELECT
            drink_flavor AS "Drink Flavor",
            IF(\`Topping(s)\` IS NULL, "None", \`Topping(s)\`) AS "Topping(s)",
            COUNT(*) AS "Times Ordered"
        FROM
            (
                SELECT
                    D.base_flavor AS drink_flavor,
                    GROUP_CONCAT(A.topping) AS "Topping(s)"
                FROM
                    DrinkOrders DO
                    INNER JOIN Drinks D ON DO.drink_id = D.drink_id
                    LEFT JOIN AddOnDetails AD ON DO.drink_order_id = AD.drink_order_id
                    LEFT JOIN AddOns A ON AD.add_on_id = A.add_on_id
                GROUP BY
                    DO.drink_order_id,
                    D.base_flavor
            ) AS subquery
        GROUP BY
            drink_flavor,
            \`Topping(s)\`
        ORDER BY
            \`Times Ordered\` DESC
        LIMIT 10;`

    db.pool.query(query1, (error1, rows1, fields) => {
        db.pool.query(query2, (error2, rows2, fields) => {
            db.pool.query(query3, (error3, rows3, fields) => {
                const data = Object.assign({options}, {topflavors: rows1}, {topaddons: rows2}, {topdrinks: rows3})
                console.log("rows3:", rows3)

                if (error1 || error2 || error3) {
                    console.log("error1:", error1)
                    console.log("error2:", error2)
                    console.log("error3:", error3)
                    next()  // something wrong occured, go next middleware
                    return
                }

                res.status(200).render('stats_top', data)
            })
        })
    })
})


// ~ See stats
app.get('/stats_top', (req, res) => {
    const options = [
        {
          option: "menu"
        , option_name: "Menu"
        , active: false
        },
        {
             option: "orders"
            , option_name: "Orders"
            , active: false
        },
        {
            option: "customers"
            , option_name: "Customers"
            , active: false
        },
        {
            option: "stats"
            , option_name: "Stats"
            , active: true
        }
    ]

    const query1 = `
        SELECT
            base_flavor AS \`Flavor\`
            , COUNT(DO.drink_order_id) AS \`Times Ordered\`
        FROM
            Drinks D LEFT JOIN DrinkOrders DO on D.drink_id = DO.drink_id
        GROUP BY
            base_flavor
        ORDER BY
            \`Times Ordered\` DESC`

    const query2 = `
        SELECT
            topping AS "Topping"
        , IF(SUM(AD.quantity) IS NULL, 0, SUM(AD.quantity)) AS "Times Added"
        FROM
            AddOns A LEFT JOIN AddOnDetails AD ON A.add_on_id = AD.add_on_id
        GROUP BY
            topping
        ORDER BY
            \`Times Added\` DESC;`

    const query3 = `
        SELECT
            drink_flavor AS "Drink Flavor",
            IF(\`Topping(s)\` IS NULL, "None", \`Topping(s)\`) AS "Topping(s)",
            COUNT(*) AS "Times Ordered"
        FROM
            (
                SELECT
                    D.base_flavor AS drink_flavor,
                    GROUP_CONCAT(A.topping) AS "Topping(s)"
                FROM
                    DrinkOrders DO
                    INNER JOIN Drinks D ON DO.drink_id = D.drink_id
                    LEFT JOIN AddOnDetails AD ON DO.drink_order_id = AD.drink_order_id
                    LEFT JOIN AddOns A ON AD.add_on_id = A.add_on_id
                GROUP BY
                    DO.drink_order_id,
                    D.base_flavor
            ) AS subquery
        GROUP BY
            drink_flavor,
            \`Topping(s)\`
        ORDER BY
            \`Times Ordered\` DESC
        LIMIT 10;`

    db.pool.query(query1, (error1, rows1, fields) => {
        db.pool.query(query2, (error2, rows2, fields) => {
            db.pool.query(query3, (error3, rows3, fields) => {
                const data = Object.assign({options}, {topflavors: rows1}, {topaddons: rows2}, {topdrinks: rows3})
                console.log("rows3:", rows3)

                if (error1 || error2 || error3) {
                    console.log("error1:", error1)
                    console.log("error2:", error2)
                    console.log("error3:", error3)
                    next()  // something wrong occured, go next middleware
                    return
                }

                res.status(200).render('stats_top', data)
            })
        })
    })
})


/*
  ~ POST
*/

app.post('/add-order-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log("data:", data)

    // Create the query and run it on the database
    query1 =
        `INSERT INTO Orders (customer_id, order_date, num_drinks)
         VALUES (
          '${data['customer_id']}'
        , '${data['order_date']}'
        , '${data['num_drinks']}'
        )`;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            query2 =
            `SELECT
            order_id
            , customer_id
            , DATE_FORMAT(order_date, '%Y-%m-%d %r') as order_date
            , num_drinks
            , total_cost FROM Orders`

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

/*
  ~ DELETE
*/

app.delete('/delete-order-ajax/', function(req,res, next){
    let data = req.body
    let order_id = parseInt(data.order_id)

    console.log("data:", data)

    let delete_orders =
        `DELETE FROM Orders
        WHERE order_id = ?`

    db.pool.query(delete_orders, [order_id], function(error, rows, fields){
        if (error) {
            console.log("delete orders: error")
            res.sendStatus(400)
        } else {
            res.sendStatus(204)
        }
    })
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
            query2 =
            `SELECT
            order_id
            , customer_id
            , DATE_FORMAT(order_date, '%Y-%m-%d %r') as order_date
            , num_drinks
            , total_cost FROM Orders`

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


/*
  ! 404
*/

// ~ Anything else... 404
app.get('*', (req, res) => {
    const options = [
        {
            option: "menu"
            , option_name: "Menu"
            , active: false
        },
        {
            option: "orders"
            , option_name: "Orders"
            , active: false
        },
        {
            option: "customers"
            , option_name: "Customers"
            , active: false
        },
        {
            option: "stats"
            , option_name: "Stats"
            , active: false
        }
    ]

    res.status(404).render('404', { options })
})