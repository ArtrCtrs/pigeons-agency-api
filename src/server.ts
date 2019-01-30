import { UsersControler } from './controllers/users-controler';
import express, { Response, Request } from 'express';
import db from './db/pgpool';
import bodyParser from 'body-parser';
import ErrorHelper from './helpers/error-helper';
import { AuthentificationControler } from './controllers/authentification-controler';
let pool = db.getPool();

console.log("hello hugo");
const app = express();

app.use(bodyParser.json());
app.use(ErrorHelper.clientErrorHandler);

initDB();

app.get('/testget', UsersControler.getUsers);

app.post('/testpost', UsersControler.addDummyUser);
app.post('/register', AuthentificationControler.register);
app.post('/login', AuthentificationControler.login);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

async function initDB() {
    let text = 'CREATE TABLE IF NOT EXISTS USERS (id SERIAL, username varchar(255) NOT NULL,password varchar(255) NOT NULL,lvl int DEFAULT 1,PRIMARY KEY (id));'
    let res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS PIGEONS (id SERIAL, name varchar(255) NOT NULL,attack int, defense int, ownerid int REFERENCES USERS(id),PRIMARY KEY (id));'
    res = await pool.query(text);
}

