/* ---------- BOBA TIME v1.2 ----------------- */
-- CS 340-001 / Step 3, Project Draft
-- NULLPTRS / Fatima Moussaoui & Kimberly Yeo
-- May 11, 2023
/* ------------------------------------------- */

-- ! NOTES:
-- Functionality with colon : denote the variables that will have data from the backend programming language
--      it will not compile with : so we have commented those lines and added example queries
-- You can search this document by looking for SELECT(s), INSERT(s), UPDATE(s), or DELETE(s) tags


/* ---------- SELECT(s) ---------------------- */
-- ? Query to see Drink Menu
SELECT
      base_flavor AS "Flavor"
    , reg_price AS "Price (R)"
    , small_price AS "Price (S)"
    , can_be_hot AS "Can be Hot"
    , is_flavored_sweetener "Flavored Sweetener"
FROM Drinks;


-- ? Query to see Toppings Menu
SELECT
      topping AS "Topping"
    , price AS "Price"
FROM AddOns;


-- ? Query to view all customer drink orders (order #,  drink # in order) and their associated toppings
SELECT
      first_name AS "Name"
    , O.order_id AS "Order_#"
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
    :first_name = first_name AND :last_name = last_name;
    -- C.first_name = "Guest1" AND C.last_name = "Guest1";


-- ? Query to see count of ordered drink flavors
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
    , phone_num
    , first_name
    , last_name
)
VALUES
    (
          :email
        , :f_name
        , :l_name
    ),


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
UPDATE DrinkOrders
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
      num_drinks = :num_drinks_input
    , total_cost = :cost_input
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
