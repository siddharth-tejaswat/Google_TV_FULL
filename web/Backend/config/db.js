// config/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "GoogleTv",
  password: "Sarthak",
  port: 5432,
});

module.exports = pool;
