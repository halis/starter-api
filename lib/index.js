const express = require('express');
const PgConnection = require('postgresql-easy');
const server = require('./server');

//const auth = require('node-token-auth');
// Configure the algorithm and password used to encrypt auth tokens
// and set the session timeout in minutes.
//auth.configure('aes-256-ctr', 'V01kmann', 1);

const app = express();
server.setup(app);

function handleError(res, err) {
  console.error('index.js handleError: err =', err);
  res.statusMessage =
    err ? `${err.toString()}; ${err.detail}` : 'unknown error';
  res.status(500).send();
}

const pg = new PgConnection({
  database: 'launchpad' // defaults to username
  //host: 'localhost', // default
  //idleTimeoutMillis: 30000, // before a client is closed (default is 30000)
  //max: 10, // max clients in pool (default is 10)
  //password: '', // not needed in this example
  //port: 5432, // the default
  //user: 'Mark' // not needed in this example
});

/**
 * Deletes a project.
 * The "Authorization" request header must be set.
 */
app.delete('/project/:id', (req, res) => {
  //if (!auth.authorize(req, res)) return;

  // id is the id of the ice cream flavor to be deleted.
  const {id} = req.params;

  const sql = 'delete from projects where id=$1';
  pg.query(sql, id)
    .then(() => res.send())
    .catch(() => handleError(res));
});

/**
 * Retrieves all projects.
 */
app.get('/project', (req, res) => {
  console.log('get /project');
  //if (!auth.authorize(req, res)) return;

  const sql = 'select * from projects';
  console.log({sql});
  pg.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(() => handleError(res));
});

/**
 * Adds a project.
 * The URL will look like /project?name=some-name.
 * The response will contain the id of newly created project.
 */
app.post('/project', (req, res) => {
  //if (!auth.authorize(req, res)) return;

  const {name} = req.query;

  // Get the id of the project if it already exists.
  let sql = 'select id from projects where name=$1';
  pg.query(sql, name)
    .then(result => {
      const [row] = result.rows;
      if (row) {
        res.send(String(row.id));
      } else {
        // The project doesn't exist, so create it.
        sql = 'insert into projects (name) values ($1) returning id';
        pg.query(sql, name)
          .then(result => {
            const [row] = result.rows;
            if (row) {
              res.send(String(row.id));
            } else {
              handleError(res, 'failed to create new flavor');
            }
          })
          .catch(() => handleError(res));
      }
    })
    .catch(() => handleError(res));
});

/**
 * Updates a project by id.
 */
app.put('/project/:id', (req, res) => {
  //if (!auth.authorize(req, res)) return;

  const {id} = req.params;
  const {name} = req.query;
  pg.updateById('projects', id, {name})
    .then(() => res.send())
    .catch(() => handleError(res));
});

server.start();
