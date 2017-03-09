#!/bin/sh

echo ""
echo "****** BEGIN ******"
echo "****** CREATING AND SEEDING DATABASE '$POSTGRES_DB' ******"
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

  insert into users values ('launchpad', 'launchpad');
  insert into users values ('mark', 'launchpad');
  insert into users values ('tyler', 'launchpad');
  insert into users values ('chris', 'launchpad');

  insert into projects (id, name, description) values (1, 'launchpad-project', 'launchpad test project');
  insert into projects (id, name, description) values (2, 'mark-project', 'mark test project');
  insert into projects (id, name, description) values (3, 'tyler-project', 'tyler test project');
  insert into projects (id, name, description) values (4, 'chris-project', 'chris test project');

  insert into user_projects values ('launchpad', 1);
  insert into user_projects values ('mark', 1);
  insert into user_projects values ('tyler', 1);
  insert into user_projects values ('chris', 1);
  insert into user_projects values ('mark', 2);
  insert into user_projects values ('tyler', 3);
  insert into user_projects values ('chris', 4);
EOSQL

echo ""
echo "****** END ******"
echo ""
