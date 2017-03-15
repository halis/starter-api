
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const PgConnection = require('postgresql-easy');
const server = require('./server');
const dbConnectionInfo = require('./db-connection-info');

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

const pg = new PgConnection(dbConnectionInfo);

//----------------------------------------------------------------------------

function returnJSON(res, filename) {
  fs.readFile(path.join(__dirname, `/${filename}.json`), (err, buf) => {
    if (err) {
      res.statusMessage = `${err.toString()}; ${err.detail}`;
      res.status(500).send();
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(buf.toString());
    }
  });
}

app.get('/crops', (req, res) => returnJSON(res, 'crops'));
app.get('/mcts', (req, res) => returnJSON(res, 'mcts'));
app.get('/regions', (req, res) => returnJSON(res, 'regions'));
app.get('/product-categories', (req, res) => returnJSON(res, 'categories'));

app.get('/product-categories/:category/product-targets', (req, res) => {
  const {category} = req.params;
  console.log('index.js: category =', category);
  res.send(['PMT1', 'PMT2', 'PMT3', 'PMT4']);
});

app.get('/product-stages', (req, res) => {
  res.send(['3O', '4A', '4B', '5A']);
});

app.get('/product-targets/:target/observations', (req, res) => {
  const {target} = req.params;
  console.log('index.js: target =', target);
  res.send([
    {code: 'HTFRM', name: 'Head: Firmness Rating', external: 0, advance: 0},
  ]);
});

//----------------------------------------------------------------------------

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
    .catch(err => handleError(res, err));
});

/**
 * Retrieves all projects.
 */
app.get('/project', (req, res) => {
  //if (!auth.authorize(req, res)) return;

  const sql = 'select * from projects';
  pg.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => handleError(res, err));
});

/**
 * Adds a project.
 * The URL will look like /project?name=some-name.
 * The response will contain the id of newly created project.
 */
app.post('/project', (req, res) => {
  //if (!auth.authorize(req, res)) return;

  const {name, description} = req.query;

  // Get the id of the project if it already exists.
  let sql = 'select id from projects where name=$1';
  pg.query(sql, name)
    .then(result => {
      const [row] = result.rows;
      if (row) {
        res.send(String(row.id));
      } else {
        // The project doesn't exist, so create it.
        sql = 'insert into projects (name, description)' +
          ' values ($1, $2) returning id';
        pg.query(sql, name, description)
          .then(result => {
            const [row] = result.rows;
            if (row) {
              res.send(String(row.id));
            } else {
              handleError(res, 'failed to create new flavor');
            }
          })
          .catch(err => handleError(res, err));
      }
    })
    .catch(err => handleError(res, err));
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
    .catch(err => handleError(res, err));
});

server.start();
