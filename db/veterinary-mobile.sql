
--- ENUMS

CREATE TYPE "cart_status" AS ENUM ('activo', 'pagado');

CREATE TYPE "order_status" AS ENUM ('Cancelado', 'En Proceso', 'Listo', 'Entregado');

CREATE TYPE "product_type" AS ENUM ('Alimento', 'Medicina', 'Accesorios', 'Juguetes');

CREATE TYPE "payment_method" AS ENUM ('PayPal', 'Efectivo');

--- Tables

--  Usuarios
CREATE TABLE "Users" (
  "user_id" integer PRIMARY KEY,
  "name" varchar(20),
  "last_name" varchar(25),
  "mother_name" varchar(25),
  "email" text,
  "phone" varchar(10),
  "password" text
);

CREATE TABLE "Categories" (
  "category_id" integer PRIMARY KEY,
  "name" varchar(20)
);

CREATE TABLE "Subcategories" (
  "subcategory_id" integer PRIMARY KEY,
  "category_id" integer,
  "name" varchar(40),
  FOREIGN KEY ("category_id") REFERENCES "Categories" ("category_id")
);

CREATE TABLE "Products" (
  "product_id" integer PRIMARY KEY,
  "name" text,
  "description" text,
  "category_id" integer,
  "subcategory_id" integer,
  "price" numeric(6,2),
  "stock" integer,
  "image_url" text,
  FOREIGN KEY ("category_id") REFERENCES "Categories" ("category_id"),
  FOREIGN KEY ("subcategory_id") REFERENCES "Subcategories" ("subcategory_id")
);

CREATE TABLE "Carts" (
  "cart_id" integer PRIMARY KEY,
  "user_id" integer,
  "total" numeric(8,2),
  "status" cart_status,
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
);

CREATE TABLE "Cart_details" (
  "details_id" integer PRIMARY KEY,
  "cart_id" integer,
  "product_id" integer,
  "price" numeric(6,2),
  "quantity" integer,
  FOREIGN KEY ("cart_id") REFERENCES "Carts" ("cart_id"),
  FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id")
);

CREATE TABLE "Orders" (
  "order_id" integer PRIMARY KEY,
  "user_id" integer,
  "order_status" order_status,
  "date" timestamp,
  "total" numeric(8,2),
  "payment_method" payment_method,
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
);

CREATE TABLE "Order_details" (
  "order_details_id" integer PRIMARY KEY,
  "order_id" integer,
  "product_id" integer,
  "name" text,
  "price" numeric(6,2),
  "quantity" integer,
  "subtotal" numeric(6,2),
  FOREIGN KEY ("order_id") REFERENCES "Orders" ("order_id"),
  FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id")
);

-- Categorías
INSERT INTO "Categories" ("category_id", "name") VALUES
(1, 'Alimentos'),
(2, 'Medicinas'),
(3, 'Accesorios'),
(4, 'Juguetes');

-- Subcategorías
INSERT INTO "Subcategories" ("subcategory_id", "category_id", "name") VALUES
(1, 2, 'Desparasitantes'),
(2, 2, 'Antibióticos'),
(3, 3, 'Collares'),
(4, 4, 'Peluches'),
(5, 1, 'Snacks');

-- Productos
INSERT INTO "Products" ("product_id", "name", "description", "category_id", "subcategory_id", "price", "stock", "image_url") VALUES
(1, 'Croquetas Premium', 'Alimento balanceado para perro adulto', 1, NULL, 350.00, 40, 'img/croquetas.jpg'),
(2, 'Desparasitante Oral', 'Antiparasitario de amplio espectro', 2, 1, 120.00, 100, 'img/desparasitante.jpg'),
(3, 'Collar Reflectante', 'Collar ajustable para perro mediano', 3, 3, 90.00, 60, 'img/collar.jpg'),
(4, 'Pelota de Goma', 'Juguete duradero para morder', 4, 4, 50.00, 150, 'img/pelota.jpg'),
(5, 'Snack Dental', 'Galletas para limpiar los dientes del perro', 1, 5, 70.00, 120, 'img/snack.jpg'),
(6, 'Antibiótico Inyectable', 'Antibiótico de amplio espectro para mascotas', 2, 2, 210.00, 80, 'img/antibiotico.jpg');

-- Usuarios
INSERT INTO "Users" ("user_id", "name", "last_name", "mother_name", "email", "phone", "password") VALUES
(1, 'Mau', 'Esperon', 'Lopez', 'mau@example.com', '5512345678', '1234'),
(2, 'Ana', 'Torres', 'Rivas', 'ana.torres@example.com', '5587654321', 'ana123'),
(3, 'Luis', 'Ramirez', 'Gomez', 'luis.rg@example.com', '5578901234', 'luis123'),
(4, 'Sofia', 'Martinez', 'Cano', 'sofia.mc@example.com', '5545678901', 'sofia123'),
(5, 'Carlos', 'Perez', 'Diaz', 'carlos.pd@example.com', '5567894321', 'carlos123');

-- Carritos
INSERT INTO "Carts" ("cart_id", "user_id", "total", "status") VALUES
(1, 1, 0.00, 'activo'),
(2, 2, 0.00, 'activo'),
(3, 1, 210.00, 'pagado'),
(4, 2, 160.00, 'pagado'),
(5, 3, 400.00, 'pagado'),
(6, 4, 140.00, 'pagado'),
(7, 5, 260.00, 'pagado');

-- productos para carrito activos
INSERT INTO "Cart_details" ("details_id", "cart_id", "product_id", "price", "quantity") VALUES
(1, 1, 1, 350.00, 1),
(2, 1, 4, 50.00, 2),
(3, 2, 5, 70.00, 1);

-- productos para  carrito pagados
INSERT INTO "Cart_details" ("details_id", "cart_id", "product_id", "price", "quantity") VALUES
(4, 3, 2, 120.00, 1),
(5, 3, 3, 90.00, 1),
(6, 4, 4, 50.00, 2),
(7, 5, 1, 350.00, 1),
(8, 6, 5, 70.00, 2),
(9, 7, 6, 210.00, 1),
(10, 7, 4, 50.00, 1);

-- ordenes / pedids xd
INSERT INTO "Orders" ("order_id", "user_id", "order_status", "date", "total", "payment_method") VALUES
(1, 1, 'En Proceso', NOW() - INTERVAL '5 days', 210.00, 'PayPal'),
(2, 2, 'Entregado', NOW() - INTERVAL '10 days', 160.00, 'Efectivo'),
(3, 3, 'Listo', NOW() - INTERVAL '2 days', 400.00, 'PayPal'),
(4, 4, 'En Proceso', NOW() - INTERVAL '1 days', 140.00, 'Efectivo'),
(5, 5, 'Cancelado', NOW() - INTERVAL '15 days', 260.00, 'PayPal');


-- Detalles de las órdenes
INSERT INTO "Order_details" ("order_details_id", "order_id", "product_id", "name", "price", "quantity", "subtotal") VALUES
(1, 1, 2, 'Desparasitante Oral', 120.00, 1, 120.00),
(2, 1, 3, 'Collar Reflectante', 90.00, 1, 90.00),
(3, 2, 4, 'Pelota de Goma', 50.00, 2, 100.00),
(4, 2, 5, 'Snack Dental', 70.00, 1, 70.00),
(5, 3, 1, 'Croquetas Premium', 350.00, 1, 350.00),
(6, 3, 4, 'Pelota de Goma', 50.00, 1, 50.00),
(7, 4, 5, 'Snack Dental', 70.00, 2, 140.00),
(8, 5, 6, 'Antibiótico Inyectable', 210.00, 1, 210.00),
(9, 5, 4, 'Pelota de Goma', 50.00, 1, 50.00);

-- Ver carrito de usuario por id
SELECT
  p.name,
  cd.price,
  cd.quantity
FROM "Users" u
JOIN "Carts" c ON u.user_id = c.user_id
JOIN "Cart_details" cd ON c.cart_id = cd.cart_id
JOIN "Products" p ON cd.product_id = p.product_id
WHERE u.user_id = 1
  AND c.status = 'activo';

-- Ver pedidos de usuario por id
-- usamos json_agg para hacerlo en un arreglo de una xd
SELECT
  o.order_id,
  o.date,
  o.order_status,
  o.total,
  JSON_AGG(p.image_url) AS image_urls
FROM "Users" u
JOIN "Orders" o ON o.user_id = u.user_id
JOIN "Order_details" od ON od.order_id = o.order_id
JOIN "Products" p ON p.product_id = od.product_id
WHERE u.user_id = 2
GROUP BY o.order_id, o.date, o.order_status, o.total;

-- Ver detalles de pedido por id
SELECT o.order_id, o.order_status, o.date, o.total, od.name, od.price, od.quantity, p.image_url, o.payment_method FROM "Orders" o
JOIN "Order_details" od ON od.order_id =  o.order_id
JOIN "Products" p ON p.product_id = od.product_id
WHERE o.order_id = 1;

-- Ver productos
SELECT product_id,name, price, image_url FROM "Products";

-- detalles de producto por id
SELECT pd.product_id, pd.name, c.name, pd.description, pd.price, pd.stock, pd.image_url FROM "Products" pd
JOIN "Categories" c ON c.category_id = pd.category_id
WHERE product_id = 2





