const { Pool } = require("pg");
const vectorizeAndSearch = require("./vectorizeAndSearch");
const searchVectorizedTerm = require("./searchVectorizedTerm");
const searchIndexedTerm = require("./searchIndexedTerm");
const searchWeightedIndexedTerm = require("./searchWeightedIndexedTerm");

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
vectorizeAndSearch.vectorizeAndSearchTerm(pool); // 240ms

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

/* Add an column 'document_with_weights' if it doesnt exist */
// searchWeightedIndexedTerm.createDocumentWitWeightedIndexColumn(pool);
/* vectorize title & description in camps with weight*/
// searchWeightedIndexedTerm.vectorizeDocumentWithWeights(pool);
/* Create 'document_weighted_index' Index if it doesnt exist */
// searchWeightedIndexedTerm.createDocumentGinWeightedIndex(pool);
/* search with weighted indexed documents */
searchWeightedIndexedTerm.searchTermWithGinWeightedIndex(pool); // 12ms
