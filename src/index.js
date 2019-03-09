const { Pool } = require("pg");
const { vectorize } = "./query";

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

// vectorize and search in same db operation
const vectorizeAndSearchTerm = () => {
  console.time("vectorizeAndSearchTerm");
  pool.query(
    `SELECT
    * 
    FROM camps
    WHERE
    to_tsvector(camps.title || ' ' || camps.description) @@ to_tsquery('star')`,
    [],
    function(err, res) {
      if (err) {
        return console.error("error running query", err);
      }
      console.timeEnd("vectorizeAndSearchTerm");
      console.log("vectorizeAndSearchTerm: res.rowCount ", res.rowCount);
    }
  );
};

// vectorize title & description in camps
const vectorization = () => {
  console.time("vectorization");
  pool.query(
    `UPDATE camps
    SET document = to_tsvector( title || '' || description )`,
    [],
    function(err, res) {
      if (err) {
        return console.error("error running query", err);
      }
      console.timeEnd("vectorization");
      console.log("vectorization: res.rowCount ", res.rowCount);
    }
  );
};

// search with vectorized documents
const searchTerm = () => {
  console.time("searchTerm");
  pool.query(
    `SELECT
    * 
    FROM camps
    WHERE
    document @@ to_tsquery('star')`,
    [],
    function(err, res) {
      if (err) {
        return console.error("error running query", err);
      }
      console.timeEnd("searchTerm");
      console.log("searchTerm: res.rowCount ", res.rowCount);
    }
  );
};

vectorizeAndSearchTerm();
vectorization();
searchTerm();
