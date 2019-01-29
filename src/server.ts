import { UsersControler } from './controllers/users-controler';
import express, { Response, Request } from 'express';
import db from './db/pgpool';
let pool = db.getPool();

console.log("hello hugo");
const app = express();

initDB();

app.get('/testget', UsersControler.getUsers);
app.post('/testpost', UsersControler.addDummyUser);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

async function initDB() {
    let text = 'CREATE TABLE IF NOT EXISTS USERS (id int, name varchar(255),password varchar(255),lvl int);'
    let res = await pool.query(text);
}

