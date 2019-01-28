import express from 'express';
console.log("hello hugo");
const app = express();

const { Pool, Client } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'iguane',
    port: 5432,
  });

  pool.query('SELECT * FROM PIGEONTEST', (err:any, res:any) => {
    console.log(res.rows[0].name+"mm")
    pool.end()
  });


app.get('/pigeon', (req, res): void => {
    res.status(200).send({
        message: 'ok',
        data: { hmhhmh: "mmmm" }
    })
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`srver rsunning on port ${PORT}`)
});