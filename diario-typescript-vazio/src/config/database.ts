const mysql = require('mysql2/promise');
import config from './database.json';

export const banco = mysql.createPool({
  host: process.env.DB_HOST || config.host,
  port: Number(process.env.DB_PORT || config.port),
  user: process.env.DB_USER || config.user,
  password: process.env.DB_PASSWORD || config.password,
  database: process.env.DB_NAME || config.database,
  connectionLimit: 10
});
