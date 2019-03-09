  SELECT
  DISTINCT
  count(*) OVER() AS camplistcount,
  camps.* ,
  affiliations.title AS affiliation_title, 
  affiliations.id AS affiliation_id
  FROM camps
  LEFT JOIN camp_affiliations
  ON camps.id = camp_affiliations.camp_id
  LEFT JOIN affiliations
  ON camp_affiliations.affiliation_id = affiliations.id
  WHERE
  to_tsvector(camps.title) @@ to_tsquery('star')
  OR
  to_tsvector(camps.description) @@ to_tsquery('star')
  LIMIT :limit
  OFFSET :offset ROWS