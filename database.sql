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
    content VARCHAR(2000) 
);

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
    description VARCHAR(2000),
    type VARCHAR(255),
    size VARCHAR(255),
    brand VARCHAR(255),
    linerType VARCHAR(255),
    pdfUrl VARCHAR(255),
    typeGlue VARCHAR(255),
    dencity VARCHAR(255)
);

create TABLE favorites(
    id SERIAL PRIMARY KEY,
    good_id INTEGER
);

create TABLE sout(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    fileType VARCHAR(255),
    fileSize INTEGER, 
    url VARCHAR(255)
);

create TABLE company(
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(255),
    shortName VARCHAR(255),
    actualAddress VARCHAR(255),
    postalAddress VARCHAR(255),
    legalAddress VARCHAR(255),
    director VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255),
    website VARCHAR(255),
    INN VARCHAR(255),
    KPP VARCHAR(255),
    OKPO VARCHAR(255),
    OGRN VARCHAR(255),
    OKVED VARCHAR(255),
    bankName VARCHAR(255),
    accountNumber VARCHAR(255),
    correspondentAccount VARCHAR(255),
    BIC VARCHAR(255)
);

create TABLE persons(
    id SERIAL PRIMARY KEY,
    imageSrc VARCHAR(255),
    name VARCHAR(255),
    descr VARCHAR(255),
    watsapp VARCHAR(255),
    email VARCHAR(255)
);