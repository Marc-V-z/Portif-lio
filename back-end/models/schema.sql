CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(200)
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  techs VARCHAR(100),
  link VARCHAR(200)
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT
);
