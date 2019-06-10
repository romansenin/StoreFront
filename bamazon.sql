drop database if exists bamazon;

create database bamazon;
use bamazon;

create table products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name varchar(100) NOT NULL,
  department_name varchar(100) NOT NULL,
  price DECIMAL(13, 4) NOT NULL,
  stock_quantity INT NOT NULL,
  primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ("Men's Short Sleeve T-shirt", "Clothing", 14.00, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("4K Smart TV", "Electronics", 797.99, 15);

insert into products (product_name, department_name, price, stock_quantity)
values ("iPhone 7", "Electronics", 279.99, 12);

insert into products (product_name, department_name, price, stock_quantity)
values ("Reclining Sofa", "Home & Kitchen", 500.00, 8);

insert into products (product_name, department_name, price, stock_quantity)
values ("Queen Size Bed", "Home & Kitchen", 240.00, 7);

insert into products (product_name, department_name, price, stock_quantity)
values ("Convertible Laptop", "Electronics", 530, 5);

insert into products (product_name, department_name, price, stock_quantity)
values ("Macbook Pro", "Electronics", 1225.00, 6);

insert into products (product_name, department_name, price, stock_quantity)
values ("Bluetooth Headphones", "Electronics", 60.00, 7);

insert into products (product_name, department_name, price, stock_quantity)
values ("Smart Watch", "Electronics", 230.00, 10);

insert into products (product_name, department_name, price, stock_quantity)
values ("Bluetooth Speaker", "Electronics", 25.99, 4);