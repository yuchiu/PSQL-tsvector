const vectorizedAndSearch = {
  // vectorize and search in same db operation
  vectorizeAndSearchTerm: pool => {
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
  }
};

module.exports = vectorizedAndSearch;
