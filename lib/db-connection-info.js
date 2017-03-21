
const env = require('./env');

module.exports = {
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOST,
  database: env.POSTGRES_DB,
  port: env.POSTGRES_PORT,
  max: env.POSTGRES_POOL,
  idleTimeoutMillis: env.POSTGRES_TIMEOUT,
};
