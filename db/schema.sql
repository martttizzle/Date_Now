DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(60) NOT NULL,
  department_name VARCHAR(60) NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  stock_quantity DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ('led-lamp', 'Electronics', 67.30, 30), ('gloves', 'Clothing', 7.99, 70),('sleeping bag', 'Sporting Goods', 100.75, 90),('bowl', 'Kitchen', 2.99, 50),("chips", 'Food', 1.50, 1000),("xbox", 'Electronics', 300.00, 25),("cookies", 'Food', 3.50, 162),("jeans", 'Clothing', 21.50, 50),( "fishing rod", 'Sporting Goods', 49.50, 300),( "blender", 'Kitchen', 25.50, 400);



SELECT * FROM products WHERE stock-quantity > 1000;





