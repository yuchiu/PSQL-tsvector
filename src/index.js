const { Pool } = require("pg");
const vectorizedAndSearch = require("./vectorizedAndSearch");
const searchVectorizedTerm = require("./searchVectorizedTerm");
const searchIndexedTerm = require("./searchIndexedTerm");

var config = {
  user: "postgres",
  database: "sleepaway_camper", // use your own database for testing
  password: "postgres",
  host: "localhost",
  port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000
};
const pool = new Pool(config);

/* vectorize and search in same db operation */
vectorizedAndSearch.vectorizeAndSearchTerm(pool); // 240ms

/* Add an column 'document' for storing vectorized data if it doesnt exist */
// searchVectorizedTerm.createDocumentColumn(pool);
/* vectorize title & description in camps */
// searchVectorizedTerm.vectorizeDocument(pool);
searchVectorizedTerm.searchVectorizedTerm(pool); // 16ms

/* Add an column 'document_with_index' if it doesnt exist */
// searchIndexedTerm.createDocumentWithIndexColumn(pool);
/* vectorize title & description in camps */
// searchIndexedTerm.vectorizeDocumentWithIndex(pool);
/* Create 'document_index' Index if it doesnt exist */
// searchIndexedTerm.createDocumentGinIndex(pool);
/* search with indexed documents */
searchIndexedTerm.searchTermWithGinIndex(pool); // 8ms
