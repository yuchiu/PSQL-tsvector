const searchVectorizedTerm = {
  // Add an column 'document' for storing vectorized data if it doesnt exist
  createDocumentColumn: pool => {
    console.time("createDocumentColumn");
    pool.query(
      `ALTER TABLE camps
      ADD COLUMN document tsvector;`,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("createDocumentColumn");
      }
    );
  },

  // vectorize title & description in camps
  vectorizeDocument: pool => {
    console.time("vectorizeDocument");
    pool.query(
      `UPDATE camps
      SET 
      document = to_tsvector( title || ' ' || coalesce(description, ''))`,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("vectorizeDocument");
      }
    );
  },

  // search with vectorized documents
  searchVectorizedTerm: pool => {
    console.time("searchVectorizedTerm");
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
        console.timeEnd("searchVectorizedTerm");
        console.log("searchVectorizedTerm: res.rowCount ", res.rowCount);
      }
    );
  }
};

module.exports = searchVectorizedTerm;
