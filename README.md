This is a REST server that uses a PostgreSQL database.

The root user must be configurd in PostgreSQL.
This can be done with these commands:
psql -d launchpad
create role root superuser;
alter role root with login;
press ctrl-d

To start the PostgreSQL server, enter:
pg_ctl -D /usr/local/var/postgres start

To initialize the database, enter:
./database/recreatedb

To start the server, enter:
npm start
This will prompt for your password because it is
using HTTPS on port 443 which is a privileged port.

To change the owner (ex. root) of a table:
psql -d launchpad
alter table {table-name} owner to {new-owner}
press ctrl-d
