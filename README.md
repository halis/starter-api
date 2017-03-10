
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
pg_ctl -D /usr/local/var/postgres start

To initialize the database, enter:
./database/recreatedb

To start the server, enter:
npm start
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

## Docker Compose

To install Docker follow the instructions here: [Installing Docker](https://docs.docker.com/docker-for-mac/install/)
*NOTE: You could use `brew` to install docker, but that won't give you `docker-compose`, `docker-machine` or the other docker tools.*

Once Docker is installed and running you can proceed with standing up a local stack:
In a shell run:
```bash
dup
```
*NOTE: `dup` is an alias. To review the actual command see the `aliases` below*

This will run docker-compose to stand up two containers: `api` and `db`
*NOTE: These containers know how to talk to each other via docker networking.*

We also **expose the ports** for these containers in the host machine, so you can test locally:
In a browser visit: https://localhost/project
*Note: This invokes a REST service to retrieve all the current projects. If this is being run for the first time, press "ADVANCED" and "Proceed to localhost (unsafe)" to allow using HTTPS with this domain.*

Or you could test the api in Postman:
GET https://localhost/project

Also since the database port is exposed to your host, you can connect to the database in the container with your favorite Postgres client such as pgAdmin.

Here are some useful docker aliases for this project:
```bash
# Usage: ddown
alias ddown="docker-compose -p launchpad down"
alias ddownhard="docker-compose -p launchpad down --volumes"

# Usage: dkimages
alias dkimages="docker rmi $(docker images -f 'dangling=true' -q) || echo No images to kill"

# Usage: dup
alias dup="dkimages && ddown && docker-compose -p launchpad up -d --force-recreate --build"

# Usage: dexec db /bin/sh
alias dexec="docker exec -ti"

# Usage: dlogs api
alias dlogs="docker logs -f"

# Usage: dps
alias dps="docker ps -a"
```

Alpine Linux is used in the containers to keep the size and build times down. Because `sudo` does not come standard, `alpine-sdk` was installed.

The ENV variable `POSTGRES_HOST` defaults to `db` which is the name used in `docker-compose.yml`. Docker adds an entry to `/etc/hosts` in the api container because of the link setup to the db container. This allows you to connect to host `db` via `PGConnection`.

The `-p launchpad` parameter for `dup` and `ddown` scopes all containers to the `project` launchpad. This allows you to easily bring all containers up and down.

It is important to note that the `--volumes` flag in alias  `ddown` will remove any associated volumes. In this case the volume for Postgres is deleted each time you run ddown or dup.

In `dup` the flag `--build` is important because it actually re-builds the docker images, if you have any changes, before bringing the containers up.
