import { UsersControler } from './controllers/users-controler';
import express, { Response, Request } from 'express';
import db from './db/pgpool';
import bodyParser from 'body-parser';
import ErrorHelper from './helpers/error-helper';
import { AuthentificationControler } from './controllers/authentification-controler';
import MiddlewareHelper from './helpers/middleware-helper';
import { PigeonsControler } from './controllers/pigeons-controler';
import { AbstractController } from './controllers/abstract-controler';
import { ExpeditionsControler } from './controllers/expeditions-controler';
let pool = db.getPool();
const cors = require('cors');
const wrapAsync = MiddlewareHelper.wrapAsync;

console.log("hello pigeons!");
const app = express();

app.use(bodyParser.json());
app.use(cors());

handleInitDB();
async function handleInitDB() {
    //await dropDB();
    await initDB();
}
app.get('/expeditions',[MiddlewareHelper.isLoggedIn], wrapAsync(ExpeditionsControler.getExpeditions));
app.post('/expeditions',[MiddlewareHelper.isLoggedIn], wrapAsync(ExpeditionsControler.launchExpedition));

app.get('/user',[MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.getUpdatedUserInfo));

app.get('/pigeons', [MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.getPigeons));
app.post('/pigeons', [MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.addPigeon)); //not ingame

app.get('/allusers', [MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.getUsers)); //all users not updated

//app.post('/testpost', [MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.addDummyUser)); //not ingame

app.post('/register', wrapAsync(AuthentificationControler.register));
app.post('/login', wrapAsync(AuthentificationControler.login));

app.use(ErrorHelper.clientErrorHandler);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

async function dropDB() {
    let text = 'DROP TABLE IF EXISTS PIGEONS';
    let res = await pool.query(text);
    text = 'DROP TABLE IF EXISTS EXPEDITIONS';
    res = await pool.query(text);
    text = 'DROP TABLE IF EXISTS USERS';
    res = await pool.query(text);

}

async function initDB() {
    let text = "CREATE TABLE IF NOT EXISTS USERS (id SERIAL,username varchar(255) NOT NULL,password varchar(255) NOT NULL,lvl int DEFAULT 1,maxbirds int DEFAULT 10, seeds int DEFAULT 0,seedsminute int DEFAULT 1, droppings int DEFAULT 0, totaldropingsminute int DEFAULT 0, wings int DEFAULT 0,xcoord int DEFAULT 0, ycoord int DEFAULT 0, lastupdate bigint NOT NULL, PRIMARY KEY (id));";
    let res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS PIGEONS (id SERIAL, type int NOT NULL,lvl int DEFAULT 1,attack int DEFAULT 1, defense int DEFAULT 1,life int DEFAULT 3, droppingsminute int DEFAULT 2,wings int DEFAULT 2, ownerid int REFERENCES USERS(id),PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS EXPEDITIONS (id SERIAL, type int NOT NULL,lvl int DEFAULT 1, starttime bigint, duration int DEFAULT 15000,finished boolean DEFAULT false, ownerid int REFERENCES USERS(id),PRIMARY KEY (id));'
    res = await pool.query(text);
}

