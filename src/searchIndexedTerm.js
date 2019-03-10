const searchIndexedTerm = {
  // Add an column 'document_with_index' if it doesnt exist
  createDocumentWithIndexColumn: pool => {
    console.time("createDocumentWithIndexColumn");
    pool.query(
      `ALTER TABLE camps
      ADD COLUMN document_with_index tsvector;`,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("createDocumentWithIndexColumn");
      }
    );
  },

  // vectorize title & description in camps
  vectorizeDocumentWithIndex: pool => {
    console.time("vectorizeDocumentWithIndex");
    pool.query(
      `UPDATE camps
    SET 
    document_with_index = to_tsvector( title || ' ' || description || ' ' || coalesce(description, ''));
    `,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("vectorizeDocumentWithIndex");
      }
    );
  },

  // Create 'document_index' Index if it doesnt exist
  createDocumentGinIndex: pool => {
    console.time("createDocumentGinIndex");
    pool.query(
      `CREATE INDEX document_index
    on camps
    USING GIN (document_with_index);`,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("createDocumentGinIndex");
      }
    );
  },

  // search with indexed documents
  searchTermWithGinIndex: pool => {
    console.time("searchTermWithGinIndex");
    pool.query(
      `SELECT
    * 
    FROM camps
    WHERE
    document_with_index @@ to_tsquery('star')`,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("searchTermWithGinIndex");
        console.log("searchTermWithGinIndex: res.rowCount ", res.rowCount);
      }
    );
  }
};

module.exports = searchIndexedTerm;
