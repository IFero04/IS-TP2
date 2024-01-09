CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    abbreviation VARCHAR(4) NOT NULL UNIQUE
);

CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    coordinates GEOMETRY
);

CREATE TABLE colleges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    height FLOAT NOT NULL,
    weight FLOAT NOT NULL,
    draftYear INT NOT NULL,
    draftRound INT NOT NULL,
    draftNumber INT NOT NULL,
    college_ref INTEGER REFERENCES colleges(id),
    country_ref INTEGER REFERENCES countries(id) NOT NULL
);

CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    season VARCHAR(8) NOT NULL,
    gp INTEGER NOT NULL,
    pts FLOAT NOT NULL,
    reb FLOAT NOT NULL,
    ast FLOAT NOT NULL,
    net_rating FLOAT NOT NULL,
    oreb_pct FLOAT NOT NULL,
    dreb_pct FLOAT NOT NULL,
    usg_pct FLOAT NOT NULL,
    ts_pct FLOAT NOT NULL,
    ast_pct FLOAT NOT NULL,
    player_ref INTEGER REFERENCES players(id) NOT NULL,
    team_ref INTEGER REFERENCES teams(id) NOT NULL,

    UNIQUE (season, player_ref, team_ref)
);
