const searchWeightedIndexedTerm = {
  // Add an column 'document_with_weights' if it doesnt exist
  createDocumentWitWeightedIndexColumn: pool => {
    console.time("createDocumentWitWeightedIndexColumn");
    pool.query(
      `ALTER TABLE camps
      ADD COLUMN document_with_weights tsvector;`,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("createDocumentWitWeightedIndexColumn");
      }
    );
  },

  // vectorize title & description in camps with weights
  vectorizeDocumentWithWeights: pool => {
    console.time("vectorizeDocumentWithWeights");
    pool.query(
      `UPDATE camps
    SET 
    document_with_weights = setweight(to_tsvector( title ), 'A') ||
    setweight(to_tsvector(coalesce(description, '')), 'C')
    `,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("vectorizeDocumentWithWeights");
      }
    );
  },

  // Create 'document_weighted_index' Index if it doesnt exist
  createDocumentGinWeightedIndex: pool => {
    console.time("createDocumentGinWeightedIndex");
    pool.query(
      `CREATE INDEX document_weighted_index
    on camps
    USING GIN (document_with_weights);`,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("createDocumentGinWeightedIndex");
      }
    );
  },

  // search with weighted indexed documents
  searchTermWithGinWeightedIndex: pool => {
    console.time("searchTermWithGinWeightedIndex");
    pool.query(
      `SELECT
    * 
    FROM camps
    WHERE
    document_with_weights @@ plainto_tsquery('star')
    ORDER BY ts_rank(document_with_weights, plainto_tsquery('star'))`,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("searchTermWithGinWeightedIndex");
        console.log(
          "searchTermWithGinWeightedIndex: res.rowCount ",
          res.rowCount
        );
      }
    );
  }
};

module.exports = searchWeightedIndexedTerm;
