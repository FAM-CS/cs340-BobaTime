/* ---------- BOBA TIME v1.3 ---------- */
-- CS 340-001 / Step 3, Project Final
-- NULLPTRS / Fatima Moussaoui & Kimberly Yeo
-- May 18, 2023
/* ------------------------------------ */


/* ---------- DROP TABLES ---------- */
DROP TABLE IF EXISTS AddOnDetails;
DROP TABLE IF EXISTS AddOns;
DROP TABLE IF EXISTS DrinkOrders;
DROP TABLE IF EXISTS Drinks;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Customers;
/* --------------------------------- */


/* ---------- CREATE TABLES ---------- */
CREATE TABLE Customers (
      customer_id INT NOT NULL AUTO_INCREMENT
    , email VARCHAR(100) NOT NULL
    , phone_num INT
    , first_name VARCHAR(100) NOT NULL
    , last_name VARCHAR(100) NOT NULL
    , num_orders INT NOT NULL DEFAULT 0
    , num_drinks INT DEFAULT 0
    , total_spent DECIMAL(9,2) DEFAULT 0
    , drinks_to_free INT DEFAULT 10
    , num_free_drinks INT DEFAULT 0
    , PRIMARY KEY (customer_id)
);


CREATE TABLE Orders (
      order_id INT NOT NULL AUTO_INCREMENT
    , customer_id INT
    , order_date TIMESTAMP NOT NULL
    , num_drinks TINYINT NOT NULL
    , total_cost DECIMAL(5,2) NOT NULL DEFAULT 0
    , PRIMARY KEY (order_id)
    , FOREIGN KEY (customer_id)
          REFERENCES Customers(customer_id)
          ON DELETE SET NULL
    , CONSTRAINT NumDrinks CHECK (num_drinks >= 1)
    , CONSTRAINT OrderCost CHECK (total_cost >= 0)
);


CREATE TABLE Drinks (
      drink_id INT NOT NULL AUTO_INCREMENT
    , base_flavor VARCHAR(100) NOT NULL
    , small_price DECIMAL(4,2) NOT NULL
    , reg_price DECIMAL(4,2) NOT NULL
    , can_be_hot BOOLEAN DEFAULT FALSE
    , is_flavored_sweetener BOOLEAN DEFAULT FALSE
    , PRIMARY KEY (drink_id)
);


CREATE TABLE DrinkOrders (
      drink_order_id INT NOT NULL AUTO_INCREMENT
    , order_id INT NOT NULL
    , drink_id INT NOT NULL
    , seq_number TINYINT NOT NULL DEFAULT 1
    , sweetness_lvl TINYINT NOT NULL DEFAULT 100
    , is_cold BOOLEAN DEFAULT TRUE
    , drink_size char(1) NOT NULL
    , PRIMARY KEY (drink_order_id)
    , FOREIGN KEY (order_id)
          REFERENCES Orders(order_id)
          ON DELETE CASCADE
    , FOREIGN KEY (drink_id)
          REFERENCES Drinks(drink_id)
          ON DELETE RESTRICT
);


CREATE TABLE AddOns (
      add_on_id INT NOT NULL AUTO_INCREMENT
    , topping VARCHAR(50) NOT NULL
    , price DECIMAL(3,2) NOT NULL
    , PRIMARY KEY (add_on_id)
);


CREATE TABLE AddOnDetails (
      add_on_detail_id INT NOT NULL AUTO_INCREMENT
    , drink_order_id INT NOT NULL
    , add_on_id INT NOT NULL
    , quantity TINYINT DEFAULT 1
    , PRIMARY KEY (add_on_detail_id)
    , FOREIGN KEY (drink_order_id)
          REFERENCES DrinkOrders(drink_order_id)
          ON DELETE CASCADE
    , FOREIGN KEY (add_on_id)
          REFERENCES AddOns(add_on_id)
          ON DELETE RESTRICT
);
/* ----------------------------------- */


/* ---------- TESTING ---------- */
-- SHOW TABLES (test that the tables were created)
-- DESCRIBE Customers;
-- DESCRIBE Orders;
-- DESCRIBE Drinks;
-- DESCRIBE AddOns;
-- DESCRIBE DrinkOrders;
-- DESCRIBE AddOnDetails;
/* ----------------------------- */


/* ---------- EXAMPLE DATA ---------- */
INSERT INTO Customers (
      email
    , first_name
    , last_name
    , num_orders
    , num_drinks
    , total_spent
    , drinks_to_free
    , num_free_drinks
)
VALUES
    (
          "guest1@bobatime.com"
        , "Guest1"
        , "Guest"
        , 3
        , 4
        , 21.05
        , 7
        , 0
    ),
    (
          "garfield@fake.com"
        , "Garfield"
        , "Cat"
        , 2
        , 2
        , 10.2
        , 8
        , 0
    ),
    (
          "otto@fake.com"
        , "Otto"
        , "Dog"
        , 0
        , 0
        , 0
        , 10
        , 0
    );


INSERT INTO Orders (
        customer_id
    , order_date
    , num_drinks
    , total_cost
)
VALUES
    (
          (SELECT customer_id FROM Customers WHERE email = "guest1@bobatime.com")
        , "2023-01-01 13:00:00"
        , 1
        , 5.4
    ),
    (
          (SELECT customer_id FROM Customers WHERE email = "guest1@bobatime.com")
        , "2023-01-15 13:00:00"
        , 2
        , 10.45
    ),
    (
          (SELECT customer_id FROM Customers WHERE email = "guest1@bobatime.com")
        , "2023-01-20 16:00:00"
        , 1
        , 5.2
    ),
    (
          (SELECT customer_id FROM Customers WHERE email = "garfield@fake.com")
        , "2023-01-27 13:00:00"
        , 1
        , 5
    ),
    (
          (SELECT customer_id FROM Customers WHERE email = "garfield@fake.com")
        , "2023-01-28 17:00:00"
        , 1
        , 5.2
    );


INSERT INTO Drinks (
      base_flavor
    , small_price
    , reg_price
    , can_be_hot
    , is_flavored_sweetener
)
VALUES
    (
        "Black Tea", 4.5, 5, TRUE, FALSE
    ),
    (
        "Green Tea", 4.5, 5, TRUE, FALSE
    ),
    (
        "Brown Sugar", 4.8, 5.2, TRUE, TRUE
    ),
    (
        "Taro", 4.5, 5, FALSE, TRUE
    ),
    (
        "Strawberry", 4.5, 5, FALSE, TRUE
    ),
    (
        "Matcha", 4.5, 5, TRUE, FALSE
    );


INSERT INTO AddOns (
      topping
    , price
)
VALUES
    (
        "Boba", 0.2
    ),
    (
        "Crystal Boba", 0.2
    ),
    (
        "Popping Boba (Strawberry)", 0.2
    ),
    (
        "Lychee", 0.2
    ),
    (
        "Red Bean", 0.25
    ),
    (
        "Pudding", 0.2
    );


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
        (SELECT order_id FROM Orders WHERE order_date = "2023-01-01 13:00:00")
        , (SELECT drink_id FROM Drinks WHERE base_flavor = "Brown Sugar")
        , 1
        , 100
        , TRUE
        , 'R'
    ),
    (
        (SELECT order_id FROM Orders WHERE order_date = "2023-01-15 13:00:00")
        , (SELECT drink_id FROM Drinks WHERE base_flavor = "Black Tea")
        , 1
        , 75
        , TRUE
        , 'R'
    ),
    (
        (SELECT order_id FROM Orders WHERE order_date = "2023-01-15 13:00:00")
        , (SELECT drink_id FROM Drinks WHERE base_flavor = "Taro")
        , 2
        , 100
        , TRUE
        , 'R'
    ),
    (
        (SELECT order_id FROM Orders WHERE order_date = "2023-01-20 16:00:00")
        , (SELECT drink_id FROM Drinks WHERE base_flavor = "Matcha")
        , 1
        , 50
        , FALSE
        , 'R'
    ),
    (
        (SELECT order_id FROM Orders WHERE order_date = "2023-01-27 13:00:00")
        , (SELECT drink_id FROM Drinks WHERE base_flavor = "Black Tea")
        , 1
        , 75
        , TRUE
        , 'R'
    ),
        (
        (SELECT order_id FROM Orders WHERE order_date = "2023-01-28 17:00:00")
        , (SELECT drink_id FROM Drinks WHERE base_flavor = "Green Tea")
        , 1
        , 75
        , TRUE
        , 'R'
    );


INSERT INTO AddOnDetails (
      drink_order_id
    , add_on_id
    , quantity
)
VALUES
    (
        (SELECT drink_order_id
        FROM DrinkOrders NATURAL JOIN Orders NATURAL JOIN Drinks
        WHERE order_date = "2023-01-01 13:00:00" AND base_flavor = "Brown Sugar")
        , (SELECT add_on_id FROM AddOns WHERE topping = "Boba")
        , 1
    ),
    (
        (SELECT drink_order_id
        FROM DrinkOrders NATURAL JOIN Orders NATURAL JOIN Drinks
        WHERE order_date = "2023-01-15 13:00:00" AND base_flavor = "Black Tea")
        , (SELECT add_on_id FROM AddOns WHERE topping = "Boba")
        , 1
    ),
    (
        (SELECT drink_order_id
        FROM DrinkOrders NATURAL JOIN Orders NATURAL JOIN Drinks
        WHERE order_date = "2023-01-15 13:00:00" AND base_flavor = "Taro")
        , (SELECT add_on_id FROM AddOns WHERE topping = "Pudding")
        , 1
    ),
    (
        (SELECT drink_order_id
        FROM DrinkOrders NATURAL JOIN Orders NATURAL JOIN Drinks
        WHERE order_date = "2023-01-15 13:00:00" AND base_flavor = "Taro")
        , (SELECT add_on_id FROM AddOns WHERE topping = "Red Bean")
        , 1
    ),
    (
        (SELECT drink_order_id
        FROM DrinkOrders NATURAL JOIN Orders NATURAL JOIN Drinks
        WHERE order_date = "2023-01-27 13:00:00" AND base_flavor = "Black Tea")
        , (SELECT add_on_id FROM AddOns WHERE topping = "Boba")
        , 1
    ),
    (
        (SELECT drink_order_id
        FROM DrinkOrders NATURAL JOIN Orders NATURAL JOIN Drinks
        WHERE order_date = "2023-01-28 17:00:00" AND base_flavor = "Green Tea")
        , (SELECT add_on_id FROM AddOns WHERE topping = "Boba")
        , 1
    );
/* ---------------------------------- */


/* ---------- TESTING ---------- */
-- SHOW TABLES (test that the data was inserted)
SELECT * FROM Customers;
SELECT * FROM Orders;
SELECT * FROM Drinks;
SELECT * FROM AddOns;
SELECT * FROM DrinkOrders;
SELECT * FROM AddOnDetails;
/* ----------------------------- */
