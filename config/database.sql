CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(80) NOT NULL,
    password VARCHAR(100) NOT NULL /*CHECK (LENGTH(password) >= 8)*/,
    email VARCHAR(100) NOT NULL UNIQUE--, 
    --CONSTRAINT check_email CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') 
)

CREATE TABLE diarybooks (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    descr VARCHAR(5000) NOT NULL,
    imageUrl VARCHAR(1000),
    userId  BIGINT NOT NULL,  
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)

CREATE TABLE commits (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    commit VARCHAR(500) NOT NULL,
    bookId BIGINT NOT NULL,
    userId BIGINT NOT NULL,
    FOREIGN KEY (bookId) REFERENCES diarybooks(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)