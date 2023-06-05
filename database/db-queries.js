// ? Source: https://darifnemma.medium.com/how-to-interact-with-mysql-database-using-async-await-promises-in-node-js-9e6c81b683da
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
