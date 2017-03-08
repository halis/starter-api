
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;

const host = process.env.POSTGRES_HOST;
const database = process.env.POSTGRES_DB;
const port = process.env.POSTGRES_PORT;
const max = process.env.POSTGRES_POOL;
const idleTimeoutMillis = process.env.POSTGRES_TIMEOUT;

module.exports = {
  user,
  password,
  host,
  database,
  port,
  max,
  idleTimeoutMillis,
};
