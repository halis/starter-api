create extension pgcrypto; -- needed to encrypt passwords

create table projects (
  id serial primary key,
  name varchar(50),
  description varchar(256)
);

create table users (
  username varchar(50) primary key,
  password varchar(60) -- encrypted length
);

create table user_projects (
  username varchar(50) references users (username),
  project_id integer references projects (id)
);
