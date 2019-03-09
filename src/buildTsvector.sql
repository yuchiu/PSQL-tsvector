/* build tsvector inverted index */
ALTER TABLE camp
ADD COLUMN document tsvector;
UPDATE camp
set document = to_tsvector(title || '' || description)