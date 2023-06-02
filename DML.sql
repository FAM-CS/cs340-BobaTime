/* ---------- BOBA TIME v1.3 ----------------- */
-- CS 340-001 / Step 3, Project Final
-- NULLPTRS / Fatima Moussaoui & Kimberly Yeo
-- May 18, 2023
/* ------------------------------------------- */

-- ! NOTES:
-- Functionality with colon : denote the variables that will have data from the backend programming language
--      it will not compile with : so we have commented those lines and added example queries
-- You can search this document by looking for SELECT(s), INSERT(s), UPDATE(s), or DELETE(s) tags


/* ---------- SELECT(s) ---------------------- */
-- ? Queries for Table selects (TO BE UPDATED)
SELECT
    drink_id AS "Drink ID"
    , base_flavor AS "Base Flavor"
    , small_price AS "Price (Small)"
    , reg_price AS "Price (Regular)"
    , IF(can_be_hot, "Yes", "No") AS "Can be Hot"
    , IF(is_flavored_sweetener, "Yes", "No") AS "Flavored Sweetener"
FROM Drinks;

SELECT 
      add_on_id AS "Add On ID"
    , topping AS "Topping"
    , price AS "Price"
FROM AddOns;

SELECT
    order_id AS "Order ID"
    , customer_id AS "Customer ID"
    , DATE_FORMAT(order_date, '%Y-%m-%d %r') as "Order Date"
    , num_drinks AS "Number of Drinks"
    , total_cost AS "Total Cost"
FROM Orders;

SELECT
    order_id AS "Order ID"
    , customer_id AS "Customer ID"
    , DATE_FORMAT(order_date, '%Y-%m-%d %r') as "Order Date"
    , num_drinks AS "Number of Drinks"
    , total_cost AS "Total Cost"
FROM Orders;

-- ? Select for table drop down
SELECT
    customer_id AS "Customer ID"
    , CONCAT(first_name, " ", last_name) AS `Full Name`
FROM Customers;


-- ? Select for Table View
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
FROM Customers;


SELECT 
      drink_order_id AS "Drink Order ID"
    , order_id AS "Order ID"
    , drink_id AS "Drink ID"
    , seq_number AS "Drink Number"
    , sweetness_lvl AS "Sweetness"
    ,  IF(is_cold, "Yes", "No") AS "Is Cold"
    , drink_size AS "Drink Size"
FROM DrinkOrders;



SELECT
    add_on_detail_id AS "Add On Detail ID"
    , drink_order_id AS "Drink Order ID"
    , add_on_id AS "Add On ID"
    , quantity AS "Quantity"
FROM AddOnDetails;

SELECT * FROM AddOnDetails;



-- ? Query to see Drink Menu
SELECT
      base_flavor AS "Flavor"
    , reg_price AS "Price (Regular)"
    , small_price AS "Price (Small)"
    , can_be_hot AS "Can be Hot"
    , is_flavored_sweetener "Flavored Sweetener"
FROM Drinks;


SELECT * FROM Customers;


-- ? Query to see Toppings Menu
SELECT
      topping AS "Topping"
    , price AS "Price"
FROM AddOns;


-- ? Query to view all customer drink orders (order #,  drink # in order) and their associated toppings
SELECT
      first_name AS "Name"
    , O.order_id AS "Order #"
    , seq_number AS "Drink # in Order"
    , base_flavor AS "Flavor"
    , topping AS "Topping(s)"
FROM
    Customers C INNER JOIN Orders O on C.customer_id = O.customer_id
    INNER JOIN DrinkOrders DO on DO.order_id = O.order_id
    INNER JOIN Drinks D on DO.drink_id = D.drink_id
    NATURAL JOIN AddOnDetails
    NATURAL JOIN AddOns;


-- ? Query to search for drink orders by X customer by their last or first name
SELECT
      CONCAT(first_name, " ", last_name) AS "Full Name"
    , O.order_id AS "Order #"
    , seq_number AS "Drink # in Order"
    , base_flavor AS "Flavor"
    , topping AS "Topping(s)"
    , order_date AS "Order Date"
FROM
    Customers C INNER JOIN Orders O on C.customer_id = O.customer_id
    INNER JOIN DrinkOrders DO on DO.order_id = O.order_id
    INNER JOIN Drinks D on DO.drink_id = D.drink_id
    NATURAL JOIN AddOnDetails
    NATURAL JOIN AddOns
WHERE
    first_name = :f_name AND last_name = :l_name;
    -- first_name = "Guest1" AND last_name = "Guest1";


-- ? Query to see count of ordered drink flavors (top flavors)
SELECT
      base_flavor AS "Flavor"
    , COUNT(DO.drink_order_id) AS "Times Ordered"
FROM
    Drinks D LEFT JOIN DrinkOrders DO on D.drink_id = DO.drink_id
GROUP BY
    base_flavor
ORDER BY
    `Times Ordered` DESC;
/* ------------------------------------------- */


/* ---------- INSERT(s) ---------------------- */
-- ? Insert a Drink flavor
INSERT INTO Drinks (
      base_flavor
    , small_price
    , reg_price
    , can_be_hot
    , is_flavored_sweetener
)
VALUES
    (
          :base_flavor
        , :small_price
        , :reg_price
        , :can_be_hot
        , :is_flavored_sweetener
    );
    -- (
    --       "Mango"
    --     , 4.5
    --     , 5
    --     , FALSE
    --     , TRUE
    -- );


-- ? Insert a topping
INSERT INTO AddOns (
      topping
    , price
)
VALUES
    (
          :topping
        , :price
    );


-- ? Insert a new customer order given email/guest email and name
INSERT INTO Customers (
      email
    , first_name
    , last_name
)
VALUES
    (
          :email
        , :f_name
        , :l_name
    );


-- ? Insert a new customer order given email/guest email and name
INSERT INTO Orders (
      customer_id
    , order_date
    , num_drinks
    , total_cost
)
VALUES
    (
          (SELECT customer_id
          FROM Customers
          WHERE email = :email AND first_name = :f_name AND last_name = :l_name)
        , :order_time
        , :num_drinks
        , :total_cost
    );


-- ? Add a given drink order based on an order by customer email and name
INSERT INTO DrinkOrders (
      order_id
    , drink_id
    , seq_number
    , sweetness_lvl
    , is_cold
    , drink_size
)
VALUES
    (
          (SELECT order_id
          FROM Orders NATURAL JOIN Customers
          WHERE order_date = :order_time AND email = :email AND first_name = :f_name AND last_name = :l_name)
        , (SELECT drink_id
           FROM Drinks
           WHERE base_flavor = :ordered_flavor)
        , :seq_number
        , :sweetness_lvl
        , :is_cold
        , :drink_size
    );


-- ? Add a topping to a given drink order
INSERT INTO AddOnDetails (
      drink_order_id
    , add_on_id
    , quantity
)
VALUES
    (
          (SELECT drink_order_id
          FROM DrinkOrders NATURAL JOIN Orders
          WHERE order_id = :order_id AND seq_number = :drink_num)
        , (SELECT add_on_id FROM AddOns WHERE topping = :topping_name)
        , :quantity
    );
/* ------------------------------------------- */


/* ---------- UPDATE(s) ---------------------- */
-- ? 
UPDATE Drinks
SET
      base_flavor = :base_flavor
    , small_price = :small_price
    , reg_price = :reg_price
    , can_be_hot = :can_be_hot
    , is_flavored_sweetener = :is_flavored_sweetener
WHERE drink_id = :drink_id;

-- ? 
UPDATE AddOns
SET
      topping = :topping
    , price = :price
WHERE add_on_id = :add_on_id;


-- ? 
UPDATE Customers
SET
      phone_num = :phone_num
    , first_name = :first_name
    , last_name = :last_name
WHERE customer_id = :customer_id;

-- ? Update a drink order to have a different flavor, sweetness, and ice/hot level
UPDATE DrinkOrders
SET
      drink_id = (
          SELECT drink_id
          FROM Drinks
          WHERE base_flavor = :flavor
      )
    , sweetness_lvl = :sweetness_lvl
    , is_cold = :is_cold
WHERE drink_order_id = :drink_order_id;


-- ? Update a drink's add on to a different topping
UPDATE AddOnDetails
SET
      add_on_id = (
          SELECT add_on_id
          FROM AddOns
          WHERE topping = :topping
      )
    , quantity = :quantity
WHERE add_on_detail_id = :add_on_detail_id;


-- ? Update Order info to have less/more drinks
UPDATE Orders
SET
      num_drinks = :num_drinks
    , total_cost = :cost_input
WHERE order_id = :order_id_input;

UPDATE Orders
SET
    num_drinks = :num_drinks
WHERE order_id = :order_id_input;
/* ------------------------------------------- */


/* ---------- DELETE(s) ---------------------- */
-- ? Delete a customer's order given ID
DELETE FROM Orders
WHERE order_id = :order_to_delete


-- ? Delete a drink order
DELETE FROM DrinkOrders
WHERE drink_order_id = :d_order_to_delete
/* ------------------------------------------- */
