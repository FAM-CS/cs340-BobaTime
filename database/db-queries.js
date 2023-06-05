// ? Source: https://darifnemma.medium.com/how-to-interact-with-mysql-database-using-async-await-promises-in-node-js-9e6c81b683da
// ? Async info: https://stackoverflow.com/questions/49432579/await-is-only-valid-in-async-function
// ? Params queries: https://github.com/mysqljs/mysql#escaping-query-values

// Connect and run queries
const db = require("./db-connector")


const run_query = (query_input) => {
    return new Promise((resolve, reject) => {
        db.pool.query(query_input, function(err, results, fields) {
            return err ? reject(err) : resolve(results)
        })
    })
}

module.exports.run_query = run_query


const run_query_param = (query_input, parameters) => {
    return new Promise((resolve, reject) => {
        db.pool.query(query_input, parameters, function(error, results, fields) {
            if (error) {
                return reject(error)
            }
            return resolve(results)
        })
    })
}

module.exports.run_query_param = run_query_param


const select_all_raw = async (table) => {
    let query =
        'SELECT * FROM ' + table + ';'
    if (table === "Orders") {
        query = `
            SELECT
                  order_id
                , customer_id
                , DATE_FORMAT(order_date, '%Y-%m-%d %r') as order_date
                , num_drinks
                , total_cost
            FROM Orders`
    }

    return await run_query(query)
}

module.exports.select_all_raw = select_all_raw


const select_all_clean = async (table) => {
    let query = ""
    switch(table) {
        case "Drinks":
            query = `
                SELECT
                    drink_id AS "Drink ID"
                    , base_flavor AS "Base Flavor"
                    , small_price AS "Price (Small)"
                    , reg_price AS "Price (Regular)"
                    , IF(can_be_hot, "Yes", "No") AS "Can be Hot"
                    , IF(is_flavored_sweetener, "Yes", "No") AS "Flavored Sweetener"
                FROM Drinks
                `
                break
        case "AddOns":
            query = `
                SELECT
                    add_on_id AS "Add On ID"
                    , topping AS "Topping"
                    , price AS "Price"
                FROM AddOns
                `
                break
        case "Orders":
            query = `
                SELECT
                    order_id AS "Order ID"
                    , customer_id AS "Customer ID"
                    , DATE_FORMAT(order_date, '%Y-%m-%d %r') as "Order Date"
                    , num_drinks AS "Number of Drinks"
                    , total_cost AS "Total Cost"
                FROM Orders
                `
                break
        case "Customers":
            query = `
                SELECT
                    customer_id AS "Customer ID"
                    , email AS "Email"
                    , phone_num AS "Phone Number"
                    , first_name AS "First Name"
                    , last_name AS "Last Name"
                    , num_orders AS "Number of Orders"
                    , num_drinks AS "Number of Drinks"
                    , total_spent AS "Total Spent"
                    , drinks_to_free AS "Drinks to Free"
                    , num_free_drinks AS "Number of Free Drinks"
                FROM Customers
                `
            break
        case "DrinkOrders":
            query = `
                SELECT
                    drink_order_id AS "Drink Order ID"
                    , order_id AS "Order ID"
                    , drink_id AS "Drink ID"
                    , seq_number AS "Drink Number"
                    , sweetness_lvl AS "Sweetness"
                    , is_cold AS "Is Cold"
                    , drink_size AS "Drink Size"
                FROM DrinkOrders
                `
            break

        case "AddOnDetails":
            query = `
                SELECT
                    add_on_detail_id AS "Add On Detail ID"
                    , drink_order_id AS "Drink Order ID"
                    , add_on_id AS "Add On ID"
                    , quantity AS "Quantity"
                FROM AddOnDetails
                `
            break
        default:
            break;
    }

    return await run_query(query)
}

module.exports.select_all_clean = select_all_clean


const select_customer_names = async () => {
    const query = `
        SELECT
          customer_id
        , CONCAT(first_name, " ", last_name) AS \`Full Name\`
        FROM Customers
        `

    return await run_query(query)
}

module.exports.select_customer_names = select_customer_names


const stats_top_flavors = async () => {
    const query = `
        SELECT
            base_flavor AS \`Flavor\`
            , COUNT(DO.drink_order_id) AS \`Times Ordered\`
        FROM
            Drinks D LEFT JOIN DrinkOrders DO on D.drink_id = DO.drink_id
        GROUP BY
            base_flavor
        ORDER BY
            \`Times Ordered\` DESC
        LIMIT 10`

    return await run_query(query)
}

const stats_top_toppings = async () => {
    const query = `
        SELECT
            topping AS "Topping"
        , IF(SUM(AD.quantity) IS NULL, 0, SUM(AD.quantity)) AS "Times Added"
        FROM
            AddOns A LEFT JOIN AddOnDetails AD ON A.add_on_id = AD.add_on_id
        GROUP BY
            topping
        ORDER BY
            \`Times Added\` DESC
        LIMIT 10`

    return await run_query(query)
}

const stats_top_drinks = async () => {
    const query = `
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
        LIMIT 10`

    return await run_query(query)
}

module.exports.stats_top_flavors = stats_top_flavors
module.exports.stats_top_toppings = stats_top_toppings
module.exports.stats_top_drinks = stats_top_drinks
