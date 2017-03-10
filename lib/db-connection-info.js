
module.exports = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
  max: process.env.POSTGRES_POOL,
  idleTimeoutMillis: process.env.POSTGRES_TIMEOUT,
};
