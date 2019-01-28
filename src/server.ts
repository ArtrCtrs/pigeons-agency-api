import express from 'express';
console.log("hello hugo");
const app = express();

const { Pool, Client } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pigeonagency',
    password: 'iguane',
    port: 5432,
  });

  initDB();
  //adddummyusers(1);
  //getDummyUsers();
  
  

//   pool.query('SELECT * FROM PIGEONTEST', (err:any, res:any) => {
//     console.log(res.rows[0].name+"mm")
//     pool.end()
//   });


app.get('/pigeon', async (req, res) => {
    let text = 'SELECT * FROM USERS;';
    let dbres = await pool.query(text); 
    res.status(200).send({
        message: 'ok',
        data: { hmhhmh: dbres.rows }
    })
});
app.post('/pigeons/:id', async (req, res) => {
    let text = "INSERT INTO USERS VALUES  ($1, 'bob', 'ttt', 2)";
    let bdres = await pool.query(text,[req.params.id]);
    res.status(200).send({
        message: 'ok',
        data: { hmhhmh: 'ok' }
    }) 
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`srver rsunning on port ${PORT}`) 
});

async function initDB(){
    let text = 'CREATE TABLE IF NOT EXISTS USERS (id int, name varchar(255),password varchar(255),lvl int);'
    let res = await pool.query(text);

    // text = 'INSERT INTO USERS VALUES (1,bob,pass,2);';
    // res = await pool.query(text);  
    // await pool.end();
}

async function adddummyusers(id:number){
    let text = "INSERT INTO USERS VALUES  ($1, 'bob', 'ttt', 2)";
    let res = await pool.query(text,[id]);
}

async function getDummyUsers(){
    let text = 'SELECT * FROM USERS;';
    let res = await pool.query(text); 
    return "eee";
}