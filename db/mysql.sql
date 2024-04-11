CRATE DATABASE IF NOT EXIST invoiceusers

CREATE TABLE user (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    mobile VARCHAR(15),
    password VARCHAR(100),
    fechaNac DATE,
    genero VARCHAR(10),
    lang VARCHAR(10)
);

CREATE TABLE address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calle VARCHAR(100),
    numero INT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    provincia VARCHAR(100),
    pais VARCHAR(100)
);

CREATE TABLE user_address (
    user_id INT,
    address_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (address_id) REFERENCES address(id)
);

CREATE TABLE invoice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    fecha DATE,
    notas TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    sku VARCHAR(100),
    proyecto VARCHAR(100),
    precio DECIMAL(10,2),
    stock INT
);


