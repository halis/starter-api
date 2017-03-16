
# Starter API

This is a REST server that uses a PostgreSQL database.
It requires configuring a user in PostgreSQL.

This can be done with these commands:
````bash
sudo -u postgres createuser launchpad
psql -d launchpad
alter user launchpad PASSWORD 'launchpad';
grant all privileges on all tables in schema public to launchpad;
ctrl-d
````

To start the PostgreSQL server, enter:
`pg_ctl -D /usr/local/var/postgres start`

To stop the PostgreSQL server, enter:
`pg_ctl -D /usr/local/var/postgres stop -m fast`

To initialize the database, enter:
`./database/recreatedb`

To start the server, enter:
sudo -E npm start
This will prompt for your password because it is
using HTTPS on port 443 which is a privileged port.

To change the owner (ex. root) of a table:
```bash
psql -d launchpad
alter table {table-name} owner to {new-owner}
press ctrl-d
```

## Environment Variables

The following environment variables are used for the database and the API:

```bash
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=db
POSTGRES_DB=launchpad
POSTGRES_PORT=5432
POSTGRES_POOL=10
POSTGRES_TIMEOUT=30000
```

`POSTGRES_USER` and `POSTGRES_PASSWORD` do not have defaults so you will need to set those in your environment.
Add them to your `.bash_profile`:
```bash
export POSTGRES_USER=user
export POSTGRES_PASSWORD=pass
```

## Cloud Foundry

To install Cloud Foundry locally, we are using pcfdev, follow the instructions here:
https://pivotal.io/platform/pcf-tutorials/getting-started-with-pivotal-cloud-foundry-dev/introduction

The cloud foundry tutorial above will have you do this, but if you restart your computer, run:
`npm run cf:init`
This will start the pcfdev VM and login to your dev space.

It is assumed that you have a local postgres database.
Your local Postgres needs to be configured to listen on all interfaces to work with pcfdev.
You will need to make the following modifications:

1) Modify `/usr/local/var/postgres/postgresql.conf` to be:
listen_addresses = '*'

2) Add the following as the first line in `/usr/local/var/postgres/pg_hba.conf`:
host    all             all             0.0.0.0/0               trust

Also note that to run your stack locally in CF, you need to set
`POSTGRES_HOST=host.pcfdev.io`

To start a new API server in a local cloud foundry container:
`npm run cf:up`

To delete the API server:
`npm run cf:down

Other useful CF commands:
`cf apps`
`cf logs app-name`
`cf logs app-name --recent`
`cf events app-name`
`cf push app-name`
`cf push app-name --no-start`
`cf delete app-name`
`cf start app-name`
`cf stop app-name`
`cf set-env APP_NAME ENV_VAR_NAME ENV_VAR_VALUE`
