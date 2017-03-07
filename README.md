This is a REST server that uses a PostgreSQL database.
It requires configuring the root user in PostgreSQL.
This can be done with these commands:
psql -d launchpad
create role root superuser;
alter role root with login;
press ctrl-d

To change the owner (ex. root) of a table:
psql -d launchpad
alter table {table-name} owner to {new-owner}
press ctrl-d
