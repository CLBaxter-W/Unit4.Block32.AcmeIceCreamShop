// imports here for express and pg
const express = require("express");
const pg = require("pg");
const app = express();
const path = require("path");

// parse the body objects
app.use(express.json());

//log the requests as they come in
app.use(require("morgan")("dev"));

// Environment variable
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_ice_cream_db"
);

const port = process.env.PORT || 3000;

// static routes here (you only need these for deployment)

// app routes here

// create a new note
app.post("/api/flavors", async (req, res, next) => {
  try {
    const SQL = `INSERT INTO flavors(name, is_favorite, stars) 
         VALUES($1, $2, $3)
         RETURNING *
         `;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.is_favorite,
      req.body.stars,
    ]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

// get all flavors
app.get("/api/flavors", async (req, res, next) => {
  try {
    const SQL = `SELECT * FROM flavors ORDER BY stars, updated_at DESC;`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

// a flavor
app.get("/api/flavors/:id", async (req, res, next) => {
  try {
    const SQL = `SELECT * 
         FROM flavors
         WHERE  id = $1;
         `;
    const response = await client.query(SQL, [req.params.id]);

    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

// update a flavor
app.put("/api/flavors/:id", async (req, res, next) => {
  try {
    const SQL = `UPDATE flavors
        SET name = $1, is_favorite = $2, stars=$3, updated_at=now()
         WHERE  id = $4;
         `;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.is_favorite,
      req.body.stars,
      req.params.id,
    ]);

    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

// delete a note
app.delete("/api/flavors/:id", async (req, res, next) => {
  try {
    const SQL = `DELETE from flavors
         WHERE  id = $1;
         `;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// create your init function

const init = async () => {
  await client.connect();

  let SQL = `
         DROP TABLE IF EXISTS flavors;
         CREATE TABLE flavors(id SERIAL PRIMARY KEY, 
           created_at TIMESTAMP DEFAULT now(),
           updated_at TIMESTAMP DEFAULT now(),
           is_favorite boolean DEFAULT false,
           stars INTEGER DEFAULT 5 NOT NULL,
           name VARCHAR(255) NOT NULL);
       `;
  await client.query(SQL);
  console.log("table created");

  SQL = `
         INSERT INTO flavors(name, is_favorite, stars) VALUES('French Vanilla', true, 5);
         INSERT INTO flavors(name, is_favorite, stars) VALUES('Chocolate', true, 5);
         INSERT INTO flavors(name, is_favorite, stars) VALUES('Coffee', true, 5);
         INSERT INTO flavors(name, is_favorite, stars) VALUES('Strawberry', false, 3);
       `;

  await client.query(SQL);
  console.log("data seeded");

  app.listen(port, () => console.log(`listening on port ${port}`));
};

// init function invocation
init();
