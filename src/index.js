const { Pool } = require("pg");

/* Connection Configuration */
var config = {
  user: "postgres",
  database: "sleepaway_camper", // use your own database as example
  password: "postgres",
  host: "localhost",
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000
};
const pool = new Pool(config);

/* Perform operations */
pool.on("error", function(err, client) {
  console.error("idle client error", err.message, err.stack);
});

pool.query("SELECT $1::int AS number", ["2"], function(err, res) {
  if (err) {
    return console.error("error running query", err);
  }
  console.log("number:", res.rows);
  process.exit(0);
});
