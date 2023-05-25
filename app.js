const express = require('express')
const hbrs_engine = require('express-handlebars')

const app = express()
var PORT_NUM = process.env.PORT || 54321

app.engine('handlebars', hbrs_engine.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

const mysql = require('mysql')
const fs = require('fs')
const db = require('./database/db-connector')


app.listen(PORT_NUM, () => {
    console.log("\n----------------- Startup... -----------------\n")
    console.log("- App is running! 🍵")
    console.log("- Local: http://localhost:%d/", PORT_NUM)
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
            option: "user"
            , option_name: "Place Orders"
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
            option: "user"
            , option_name: "Place Orders"
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
            option: "user"
            , option_name: "Place Orders"
            , active: false
        }
    ]

    res.status(200).render('orders', { options })
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
            option: "user"
            , option_name: "Place Orders"
            , active: false
        }
    ]


    const query1 = "SELECT * FROM Customers";
    db.pool.query(query1, (error1, rows, fields) => {
        const data = Object.assign({options}, {data: rows})

        if (error1) {
            console.log("error1:", error1)
            console.log("error2:", error2)
            next()  // something wrong occured, go next middleware
            return
        }

        res.status(200).render('customers', data)
    })
})


// ~ Place Orders
app.get('/user', (req, res) => {
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
            option: "user"
            , option_name: "Place Orders"
            , active: true
        }
    ]

    res.status(200).render('user', { options })
})


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
            option: "user"
            , option_name: "Place Orders"
            , active: false
        }
    ]

    res.status(404).render('404', { options })
})
