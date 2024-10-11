create TABLE person(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255)
);

create TABLE post(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);

create TABLE sertificates(
    id SERIAL PRIMARY KEY,
    imageSrc VARCHAR(255),
    type VARCHAR(255),
    title VARCHAR(255)
);

create TABLE news(
    id SERIAL PRIMARY KEY,
    imagesSrc text Array,
    title VARCHAR(255),
    descr VARCHAR(255),
    content VARCHAR(255) 
);
-- Настя, измени поле

create TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255), 
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255)
);

create TABLE knowledge(
    id SERIAL PRIMARY KEY,
    file VARCHAR(255),
    file_name VARCHAR(255),
    title VARCHAR(255),
    content text
); 

create TABLE reset(
    id SERIAL PRIMARY KEY,
    resetToken VARCHAR(255),
    resetTokenExp VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

create TABLE goods( 
    id SERIAL PRIMARY KEY,
    imageUrl VARCHAR(255),
    material VARCHAR(255),
    goodsPersonalImages text Array,
    goodsIndustrialImages text Array,
    parameter integer Array,
    mainParameter integer Array,
    article VARCHAR(255),
    advantages text Array,
    thickness VARCHAR(255),
    volume VARCHAR(255),
    pcs VARCHAR(255), 
    baseType VARCHAR(255),
    color VARCHAR(255),
    heatResistance VARCHAR(255),
    name VARCHAR(255),
    description VARCHAR(255),
    type VARCHAR(255),
    size VARCHAR(255),
    brand VARCHAR(255),
    linerType VARCHAR(255),
    pdfUrl VARCHAR(255),
    typeGlue VARCHAR(255),
    dencity VARCHAR(255)
);