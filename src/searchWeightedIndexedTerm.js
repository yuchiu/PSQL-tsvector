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
    setweight(to_tsvector(coalesce(description, '')), 'B')
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
    camps.*,
    /* display ranking score of individual item */
    ts_rank(document_with_weights, plainto_tsquery('star')) 
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

const triggerCampTsvectorUpdate = {
  // create trigger for updating camp's vectorized columns
  createUpdateTrigger: pool => {
    console.time("createUpdateTrigger");
    pool.query(
      `CREATE FUNCTIOn camp_tsvector_trigger() RETURNS trigger AS $$
      begin
        new.document_with_weights :=
        setweight(to_tsvector( title ), 'A') ||
        setweight(to_tsvector(coalesce(description, '')), 'B');
        return new;
      end 
      $$ LANGUAGE plpgsql;
      
      CREATE TRIGGER tsvoctorupdate BEFORE INSERT OR UPDATE
      ON camps FOR EACH ROW EXECUTE PROCEDURE camp_tsvector_trigger();
      `,
      [],
      function(err, res) {
        if (err) {
          return console.error("error running query", err);
        }
        console.timeEnd("createUpdateTrigger");
        console.log("createUpdateTrigger: res.rowCount ", res.rowCount);
      }
    );
  }
};

module.exports = { searchWeightedIndexedTerm, triggerCampTsvectorUpdate };
