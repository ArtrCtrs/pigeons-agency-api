import { UsersControler } from './controllers/users-controler';
import express, { Response, Request } from 'express';
import db from './db/pgpool';
import bodyParser from 'body-parser';
import ErrorHelper from './helpers/error-helper';
import { AuthentificationControler } from './controllers/authentification-controler';
import MiddlewareHelper from './helpers/middleware-helper';
let pool = db.getPool();
const wrapAsync = MiddlewareHelper.wrapAsync;

console.log("hello hugo");
const app = express();

app.use(bodyParser.json());
app.use(ErrorHelper.clientErrorHandler);

initDB();

app.get('/testget', wrapAsync(UsersControler.getUsers));

app.post('/testpost', wrapAsync(UsersControler.addDummyUser));
app.post('/register', wrapAsync(AuthentificationControler.register));
app.post('/login', wrapAsync(AuthentificationControler.login));

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

async function initDB() {
    let text = 'CREATE TABLE IF NOT EXISTS USERS (id SERIAL, username varchar(255) NOT NULL,password varchar(255) NOT NULL,lvl int DEFAULT 1,maxbirds int DEFAULT 5, grain int DEFAULT 0, PRIMARY KEY (id));'
    let res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS PIGEONS (id SERIAL, type int NOT NULL,attack int, defense int, ownerid int REFERENCES USERS(id),PRIMARY KEY (id));'
    res = await pool.query(text);
}

