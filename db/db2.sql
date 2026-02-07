-- ==============================
-- ENUMS
-- ==============================
CREATE TYPE "order_status" AS ENUM (
  'Cancelado',
  'En Proceso',
  'Listo',
  'Entregado'
);

CREATE TYPE "payment_method" AS ENUM (
  'PayPal',
  'Efectivo'
);

-- ==============================
-- TABLAS
-- ==============================
CREATE TABLE "Users" (
  "user_id" SERIAL PRIMARY KEY,
  "name" varchar(20),
  "last_name" varchar(25),
  "mother_name" varchar(25),
  "email" text,
  "phone" varchar(10),
  "password" text,
  "status" boolean DEFAULT true
);

CREATE TABLE "Carts" (
  "cart_id" SERIAL PRIMARY KEY,
  "user_id" integer
);

CREATE TABLE "Orders" (
  "order_id" SERIAL PRIMARY KEY,
  "user_id" integer,
  "order_status" order_status,
  "date" timestamp,
  "total" numeric(10,2),
  "payment_method" payment_method
);

CREATE TABLE "Order_details" (
  "order_details_id" SERIAL PRIMARY KEY,
  "order_id" integer,
  "product_id" varchar(50),
  "name" text,
  "price" numeric(10,2),
  "quantity" integer
);

CREATE TABLE "Cart_details" (
  "details_id" SERIAL PRIMARY KEY,
  "cart_id" integer,
  "product_id" varchar(50),
  "quantity" integer
);

CREATE TABLE "Categories" (
  "category_id" SERIAL PRIMARY KEY,
  "name" varchar(20)
);

CREATE TABLE "Subcategories" (
  "subcategory_id" SERIAL PRIMARY KEY,
  "category_id" integer,
  "name" varchar(40)
);

CREATE TABLE "Products" (
  "product_id" varchar(50) PRIMARY KEY,
  "name" text,
  "description" text,
  "category_id" integer,
  "subcategory_id" integer,
  "price" numeric(10,2),
  "stock" integer,
  "image_url" text,
  "status" boolean DEFAULT true
);

-- ==============================
-- FOREIGN KEYS
-- ==============================
ALTER TABLE "Carts"
  ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id");

ALTER TABLE "Cart_details"
  ADD FOREIGN KEY ("cart_id") REFERENCES "Carts" ("cart_id");

ALTER TABLE "Cart_details"
  ADD FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id");

ALTER TABLE "Products"
  ADD FOREIGN KEY ("category_id") REFERENCES "Categories" ("category_id");

ALTER TABLE "Products"
  ADD FOREIGN KEY ("subcategory_id") REFERENCES "Subcategories" ("subcategory_id");

ALTER TABLE "Subcategories"
  ADD FOREIGN KEY ("category_id") REFERENCES "Categories" ("category_id");

ALTER TABLE "Orders"
  ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id");

ALTER TABLE "Order_details"
  ADD FOREIGN KEY ("order_id") REFERENCES "Orders" ("order_id");

ALTER TABLE "Order_details"
  ADD FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id");

-- ==============================
-- PROCEDIMIENTOS
-- ==============================

-- Nuevo usuario + carrito
CREATE OR REPLACE PROCEDURE sp_new_user(
    p_name varchar,
    p_last_name varchar,
    p_mother_name varchar,
    p_email text,
    p_phone varchar,
    p_password text
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_user INT;
BEGIN
    IF EXISTS (SELECT 1 FROM "Users" WHERE email = p_email) THEN
        RAISE EXCEPTION 'El email ya está registrado';
    END IF;

    IF EXISTS (SELECT 1 FROM "Users" WHERE phone = p_phone) THEN
        RAISE EXCEPTION 'El teléfono ya está registrado';
    END IF;

    INSERT INTO "Users" (name, last_name, mother_name, email, phone, password)
    VALUES (p_name, p_last_name, p_mother_name, p_email, p_phone, p_password)
    RETURNING user_id INTO new_user;

    INSERT INTO "Carts" (user_id)
    VALUES (new_user);
END;
$$;

-- Nueva categoría
CREATE OR REPLACE PROCEDURE sp_new_category(
    p_name varchar
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Categories" WHERE LOWER(name) = LOWER(p_name)) THEN
        RAISE EXCEPTION 'La categoría ya existe.';
    END IF;

    INSERT INTO "Categories" (name)
    VALUES (p_name);
END $$;

-- Nueva subcategoría
CREATE OR REPLACE PROCEDURE sp_new_subcategory(
    p_category_id integer,
    p_name varchar
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Subcategories"
        WHERE category_id = p_category_id
        AND LOWER(name) = LOWER(p_name)
    ) THEN
        RAISE EXCEPTION 'La subcategoría ya existe en esta categoría.';
    END IF;

    INSERT INTO "Subcategories" (category_id, name)
    VALUES (p_category_id, p_name);
END $$;

-- Nuevo producto
CREATE OR REPLACE PROCEDURE sp_new_product(
    p_product_id varchar,
    p_name text,
    p_description text,
    p_category_id integer,
    p_subcategory_id integer,
    p_price numeric,
    p_stock integer,
    p_image_url text
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Products" WHERE product_id = p_product_id) THEN
        RAISE EXCEPTION 'El ID del producto  ya existe.';
    END IF;

    IF EXISTS (SELECT 1 FROM "Products" WHERE LOWER(name) = LOWER(p_name)) THEN
        RAISE EXCEPTION 'El nombre de producto ya está registrado.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM "Categories" WHERE category_id = p_category_id) THEN
        RAISE EXCEPTION 'La categoría no existe.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM "Subcategories" WHERE subcategory_id = p_subcategory_id) THEN
        RAISE EXCEPTION 'La subcategoría no existe.';
    END IF;

    INSERT INTO "Products" (
        product_id, name, description, category_id, subcategory_id,
        price, stock, image_url
    )
    VALUES (
        p_product_id, p_name, p_description, p_category_id,
        p_subcategory_id, p_price, p_stock, p_image_url
    );
END $$;

-- Agregar al carrito con validación de stock
CREATE OR REPLACE PROCEDURE sp_add_to_cart(
    p_cart_id INT,
    p_product_id varchar,
    p_quantity INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_stock INT;
    current_quantity INT;
    cart_exists INT;
BEGIN
    SELECT COUNT(*) INTO cart_exists
    FROM "Carts"
    WHERE cart_id = p_cart_id;

    IF cart_exists = 0 THEN
        RAISE EXCEPTION 'El carrito no existe.';
    END IF;

    SELECT stock INTO current_stock
    FROM "Products"
    WHERE product_id = p_product_id;

    IF current_stock IS NULL THEN
        RAISE EXCEPTION 'El producto no existe.';
    END IF;

    SELECT quantity INTO current_quantity
    FROM "Cart_details"
    WHERE cart_id = p_cart_id
    AND product_id = p_product_id;

    IF current_quantity IS NULL THEN
        current_quantity := 0;
    END IF;

    IF current_quantity + p_quantity > current_stock THEN
        RAISE EXCEPTION 'No hay suficiente stock para el producto';
    END IF;

    IF current_quantity = 0 THEN
        INSERT INTO "Cart_details" (cart_id, product_id, quantity)
        VALUES (p_cart_id, p_product_id, p_quantity);
    ELSE
        UPDATE "Cart_details"
        SET quantity = quantity + p_quantity
        WHERE cart_id = p_cart_id AND product_id = p_product_id;
    END IF;
END;
$$;

-- Crear orden con transacción y FOR UPDATE
CREATE OR REPLACE PROCEDURE sp_create_order(
    p_user_id INT,
    p_payment_method payment_method
)
LANGUAGE plpgsql
AS $$
DECLARE
    _cart_id INT;
    order_total NUMERIC;
    new_order INT;
BEGIN
    SELECT cart_id INTO _cart_id FROM "Carts" WHERE user_id = p_user_id;
    IF _cart_id IS NULL THEN
        RAISE EXCEPTION 'El usuario no tiene carrito.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM "Cart_details" cd
        JOIN "Products" p ON p.product_id = cd.product_id
        WHERE cd.cart_id = _cart_id
          AND cd.quantity > p.stock
        FOR UPDATE
    ) THEN
        RAISE EXCEPTION 'Uno o más productos del carrito no tienen stock suficiente.';
    END IF;

    SELECT SUM(p.price * cd.quantity) INTO order_total
    FROM "Cart_details" cd
    JOIN "Products" p ON p.product_id = cd.product_id
    WHERE cd.cart_id = _cart_id;

    IF order_total IS NULL THEN
        RAISE EXCEPTION 'El carrito está vacío.';
    END IF;

    INSERT INTO "Orders" (user_id, order_status, date, total, payment_method)
    VALUES (p_user_id, 'En Proceso', NOW(), order_total, p_payment_method)
    RETURNING order_id INTO new_order;

    INSERT INTO "Order_details" (order_id, product_id, name, price, quantity)
    SELECT
        new_order,
        p.product_id,
        p.name,
        p.price,
        cd.quantity
    FROM "Cart_details" cd
    JOIN "Products" p ON p.product_id = cd.product_id
    WHERE cd.cart_id = _cart_id;

    UPDATE "Products" p
    SET stock = stock - cd.quantity
    FROM "Cart_details" cd
    WHERE cd.cart_id = _cart_id
      AND p.product_id = cd.product_id;

    DELETE FROM "Cart_details" WHERE cart_id = _cart_id;
END;
$$;

-- ACTUALIZAR USUARI
CREATE OR REPLACE PROCEDURE sp_update_user(
    p_user_id INT,
    p_name VARCHAR DEFAULT NULL,
    p_last_name VARCHAR DEFAULT NULL,
    p_mother_name VARCHAR DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_phone VARCHAR DEFAULT NULL,
    p_password TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- validaciones i
    IF NOT EXISTS (SELECT 1 FROM "Users" WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'El usuario  no existe'
            USING ERRCODE = 'P0001';
    END IF;

    IF p_email IS NOT NULL THEN
        IF EXISTS(
            SELECT 1 FROM "Users"
            WHERE email = p_email AND user_id <> p_user_id
        ) THEN
            RAISE EXCEPTION 'El email ya está registrado'
                USING ERRCODE = 'P0002';
        END IF;
    END IF;

    IF p_phone IS NOT NULL THEN
        IF EXISTS(
            SELECT 1 FROM "Users"
            WHERE phone = p_phone AND user_id <> p_user_id
        ) THEN
            RAISE EXCEPTION 'El teléfono ya está registrado'
                USING ERRCODE = 'P0003';
        END IF;
    END IF;

    UPDATE "Users"
    SET
        name = COALESCE(p_name, name),
        last_name = COALESCE(p_last_name, last_name),
        mother_name = COALESCE(p_mother_name, mother_name),
        email = COALESCE(p_email, email),
        phone = COALESCE(p_phone, phone),
        password = COALESCE(p_password, password)
    WHERE user_id = p_user_id;

END;
$$;


CALL sp_update_user(
    1,
    'Mauricio',
    'Esperon',
    'Andrade',
    'melvin@exasple.com',
    '1234567790',
    '123'
);


-- ELIMINAR USUARI
CREATE OR REPLACE PROCEDURE sp_delete_user(
    p_user_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Users"
    SET status = false
    WHERE user_id = p_user_id;
END;
$$;

-- ACTUALIZAR PRODUCTO
CREATE OR REPLACE PROCEDURE sp_update_product(
    p_product_id VARCHAR,
    p_name TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_category_id INT DEFAULT NULL,
    p_subcategory_id INT DEFAULT NULL,
    p_price NUMERIC DEFAULT NULL,
    p_stock INT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_status BOOLEAN DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Products"
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        category_id = COALESCE(p_category_id, category_id),
        subcategory_id = COALESCE(p_subcategory_id, subcategory_id),
        price = COALESCE(p_price, price),
        stock = COALESCE(p_stock, stock),
        image_url = COALESCE(p_image_url, image_url),
        status = COALESCE(p_status, status)
    WHERE product_id = p_product_id;
END;
$$;

-- ELIMINAR PRODUCTO
CREATE OR REPLACE PROCEDURE sp_delete_product(
    p_product_id VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Products"
    SET status = false
    WHERE product_id = p_product_id;
END;
$$;

-- activar PRODUCTO
CREATE OR REPLACE PROCEDURE sp_active_product(
    p_product_id VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "Products"
    SET status = true
    WHERE product_id = p_product_id;
END;
$$;


-- ELIMINAR PRODUCTOS DEL CARRITO
CREATE OR REPLACE PROCEDURE sp_remove_from_cart(
    p_cart_id INT,
    p_product_id VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM "Cart_details"
    WHERE cart_id = p_cart_id AND product_id = p_product_id;
END;
$$;

-- ACTUALIZAR CANTIDAD EN EL CARRITO
CREATE OR REPLACE PROCEDURE sp_update_cart_quantity(
    p_cart_id INT,
    p_product_id VARCHAR,
    p_quantity INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    current_stock INT;
BEGIN
    SELECT stock INTO current_stock FROM "Products" WHERE product_id = p_product_id;

    IF current_stock IS NULL THEN
        RAISE EXCEPTION 'El producto  no existe.';
    END IF;

    IF p_quantity > current_stock THEN
        RAISE EXCEPTION 'No hay suficiente stock';
    END IF;

    IF p_quantity <= 0 THEN
        -- Si la cantidad es 0 o negativa, eliminar del carrito
        DELETE FROM "Cart_details"
        WHERE cart_id = p_cart_id AND product_id = p_product_id;
    ELSE
        -- Actualizar cantidad
        UPDATE "Cart_details"
        SET quantity = p_quantity
        WHERE cart_id = p_cart_id AND product_id = p_product_id;
    END IF;
END;
$$;


-- ==============================
-- FUNCIONES Y VISTAS
-- ==============================

-- carrito
CREATE OR REPLACE FUNCTION fn_user_cart(p_user_id INT)
RETURNS TABLE(
    cart_id INT,
    product_id VARCHAR,
    name TEXT,
    image_url TEXT,
    price NUMERIC,
    quantity INT,
    subtotal NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validac
    IF NOT EXISTS (
        SELECT 1 FROM "Users" WHERE user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'El usuario no existe';
    END IF;

    RETURN QUERY
        SELECT
            cd.cart_id,
            cd.product_id,
            p.name,
            p.image_url,
            p.price,
            cd.quantity,
            (p.price * cd.quantity) AS subtotal
        FROM "Cart_details" cd
        JOIN "Carts" c ON c.cart_id = cd.cart_id
        JOIN "Products" p ON p.product_id = cd.product_id
        WHERE c.user_id = p_user_id;
END;
$$;


-- funcion del ogin retorna id de usuario y carrito
CREATE OR REPLACE FUNCTION login_user(p_email text, p_password text)
RETURNS TABLE(user_id int, cart_id int) AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, C.cart_id
    FROM "Users" u
    JOIN "Carts" C on u.user_id = C.user_id
    WHERE "email" = p_email
      AND "password" = p_password;
END;
$$ LANGUAGE plpgsql;

select * from login_user('mau@example.com', '123');

CREATE OR REPLACE VIEW vw_user_orders AS
SELECT
    o.user_id,
    o.order_id,
    o.date,
    o.total,
    o.order_status,
    o.payment_method
FROM "Orders" o;

CREATE OR REPLACE VIEW vw_order_details AS
SELECT
    o.order_id,
    o.user_id,
    o.date,
    o.order_status,
    o.payment_method,
    od.order_details_id,
    od.product_id,
    od.name AS product_name,
    od.price AS product_price,
    od.quantity,
    (od.price * od.quantity) AS line_total,
    o.total AS order_total
FROM "Orders" o
JOIN "Order_details" od ON od.order_id = o.order_id;

CREATE OR REPLACE VIEW vw_products_active AS
SELECT
    product_id,
    name,
    price,
    image_url
FROM "Products"
WHERE stock > 0 AND status = true;

CREATE OR REPLACE VIEW vw_product_details AS
SELECT
    p.product_id,
    p.name,
    p.description,
    p.price,
    p.stock,
    p.image_url,
    p.status,
    c.name AS category_name,
    s.name AS subcategory_name
FROM "Products" p
LEFT JOIN "Categories" c ON c.category_id = p.category_id
LEFT JOIN "Subcategories" s ON s.subcategory_id = p.subcategory_id;

CREATE  OR REPLACE VIEW vw_user_dats AS
SELECT user_id, name, last_name, mother_name, email, phone, password FROM "Users";

SELECT * FROM vw_user_dats WHERE user_id = 3;

-- ==============================
-- DATOS DE PRUEBA
-- ==============================
CALL sp_new_user('Mauricio', 'Esperon', 'Lopez', 'mau@example.com', '5512345678', '123');

CALL sp_new_category('Alimento');
CALL sp_new_category('Medicina');
CALL sp_new_category('Juguete');
CALL sp_new_category('Accesorios');

CALL sp_new_subcategory(1, 'Húmedo');
CALL sp_new_subcategory(1, 'Seco');
CALL sp_new_subcategory(2, 'Desparasitante');
CALL sp_new_subcategory(2, 'Vitaminas');
CALL sp_new_subcategory(3, 'Pelotas');
CALL sp_new_subcategory(3, 'Interactivos');
CALL sp_new_subcategory(4, 'Collares');
CALL sp_new_subcategory(4, 'Ropa');

CALL sp_new_product('DOG011','Royal Canin Urinary 10kg','Alimento urinario premium',1,2,950,30,'img1');
CALL sp_new_product('MED001','Desparasitante ProPlus','Amplio espectro',2,3,120,50,'img2');
CALL sp_new_product('TOY002','Pelota Rebotona XLL','Pelota grande',3,5,80,100,'img3');


-- ver carrito
SELECT * FROM fn_user_cart(1);

-- Agregar productos al carrito
CALL sp_add_to_cart(1, 'DOG011', 2);
CALL sp_add_to_cart(1, 'MED001', 3);
CALL sp_add_to_cart(1, 'TOY001', 1);

-- otra vez cart
SELECT * FROM fn_user_cart(1);

-- prueba de actualizar cart
-- aumentar llega a 0 y elimina
CALL sp_update_cart_quantity(1, 'DOG011', 0);

-- Crear orden
CALL sp_create_order(1, 'Efectivo');

-- Consultas de prueba
SELECT * FROM fn_user_cart(1);
SELECT * FROM vw_user_orders WHERE user_id = 1;
SELECT * FROM vw_order_details WHERE order_id = 5;
SELECT * FROM "Products";


SELECT * FROM "Users";
