#!/bin/sh

echo ""
echo "*** creating tables for database $POSTGRES_DB ***"
echo ""

psql -U $POSTGRES_USER -d $POSTGRES_DB <<- EOSQL
  create extension pgcrypto;
  grant all privileges on database $POSTGRES_DB to $POSTGRES_USER;

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
EOSQL

echo ""
echo "*** tables created for database $POSTGRES_DB ***"
echo ""
