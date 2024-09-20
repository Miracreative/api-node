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
    imageSrc VARCHAR(255)
);

create TABLE news(
    id SERIAL PRIMARY KEY,
    imagesSrc text Array,
    title VARCHAR(255),
    descr VARCHAR(255),
    content VARCHAR(255)
);

create TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),role VARCHAR(255)
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