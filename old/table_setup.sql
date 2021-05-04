SELECT * FROM ms_data;

DROP TABLE IF EXISTS ms_data;

CREATE TABLE ms_data (
incident_id INT PRIMARY KEY,
incident_date DATE,
state VARCHAR,
city_county VARCHAR,
address VARCHAR,
number_killed INT,
number_injured INT,
latitude DEC,
longitude DEC
);