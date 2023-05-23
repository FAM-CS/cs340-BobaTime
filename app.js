const express = require('express')
const hbrs_engine = require('express-handlebars')

const app = express()
var PORT_NUM = process.env.PORT || 54321

app.engine('handlebars', hbrs_engine.engine())
app.set('view engine', 'handlebars')
app.set('views', './views')


app.listen(PORT_NUM, () => {
    console.log("\n----------------- Startup... -----------------")
    console.log("App is running! 🍵\n")
    console.log("- Local: http://localhost:%d/", PORT_NUM)
    console.log("-------------------- Logs --------------------")
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

    res.render('home', { options })
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

    res.render('menu', { options })
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

    res.render('orders', { options })
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

    res.render('customers', { options })
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

    res.render('user', { options })
})