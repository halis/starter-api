
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');

const errorHandler = (err, req, res, next) => {
  if (err == null) return next();
  console.error(err.stack);
  res.status(500).send();
};

const isLocalDevelopment = req => req.hostname === 'localhost';
const isOriginalRequestSecure = req => req.headers['x-forwarded-proto'] === 'https';

const ensureHTTPS = (req, res, next) => {
  if (isLocalDevelopment(req)) {
    return next();
  }
  if (isOriginalRequestSecure(req)) {
    return next();
  }
  res.status(403).send({
    message: 'SSL required',
  });
};

let app;
function setup(_app) {
  app = _app;
  // Suppress the x-powered-by response header
  // so hackers don't get a clue that might help them.
  app.set('x-powered-by', false);

  app.use(ensureHTTPS);

  // Enable use of CORS.
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
      'Accept, Authorization, Content-Type, Origin, X-Requested-With');
    res.header('Access-Control-Expose-Headers',
      'Authorization, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,DELETE,POST,PUT');
    next();
  });
  app.use(bodyParser.json({extended: true}));

  app.use(errorHandler); // the error handler needs to be last
}

function start() {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log('listening on port', PORT));
}

module.exports = {setup, start};
