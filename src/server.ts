import { UpgradesControler } from './controllers/upgrades-controler';
import { UsersControler } from './controllers/users-controler';
import express, { Response, Request } from 'express';
import db from './db/pgpool';
import bodyParser from 'body-parser';
import ErrorHelper from './helpers/error-helper';
import { AuthentificationControler } from './controllers/authentification-controler';
import MiddlewareHelper from './helpers/middleware-helper';
import { PigeonsControler } from './controllers/pigeons-controler';
import { ExpeditionsControler } from './controllers/expeditions-controler';
import { AttackControler } from './controllers/attack-controler';
import { MessagesControler } from './controllers/messages-controler';
let pool = db.getPool();
const cors = require('cors');
const wrapAsync = MiddlewareHelper.wrapAsync;

console.log("hello pigeons!");
const app = express();

app.use(bodyParser.json());
const corsOptions = {
    origin: ["http://localhost:4200","http://pigeons.agency"],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

handleInitDB();
async function handleInitDB() {
    await dropDB();
    await initDB();
}
app.get('/expeditions', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(ExpeditionsControler.getExpeditions));
app.post('/expeditions', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(ExpeditionsControler.launchExpedition));

app.get('/upgrades', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.getCurrentUpgrades));
app.post('/upgrades/farm', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.upgradeFarm));
app.post('/upgrades/aviary', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.upgradeAviary));
app.post('/upgrades/farmstorage', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.upgradeFarmStorage));
app.post('/upgrades/droppingsstorage', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.upgradeDroppingsStorage));

app.get('/user', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.getUpdatedUserInfo));

app.get('/pigeons', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.getPigeons));
//app.post('/pigeons', [MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.addPigeon)); //not ingame, for testing
app.post('/pigeons/sell', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.sellPigeon));
app.post('/pigeons/feed', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.feedPigeon));
app.post('/pigeons/attacker', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.setAttacker));
app.post('/pigeons/defender', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.setDefender));

app.post('/attack', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(AttackControler.attackPlayer));

app.get('/messages', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(MessagesControler.getMessages));

app.get('/allusers', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.getAllUsers));
app.get('/allusers/attacks', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.getUsersForAttacks));

app.post('/register', [MiddlewareHelper.logRequest], wrapAsync(AuthentificationControler.register));
app.post('/login', [MiddlewareHelper.logRequest], wrapAsync(AuthentificationControler.login));

app.use(ErrorHelper.clientErrorHandler);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

async function dropDB() {
    // let text = 'DROP TABLE IF EXISTS PIGEONS';
    // let res = await pool.query(text);
    // text = 'DROP TABLE IF EXISTS EXPEDITIONS';
    // res = await pool.query(text);
    //  text = 'DROP TABLE IF EXISTS USERS';
    //  res = await pool.query(text);
    // text = 'DROP TABLE IF EXISTS LOGS';
    // res = await pool.query(text);
    //  text = 'DROP TABLE IF EXISTS ERRORS';
    //  res = await pool.query(text);
    // text = 'DROP TABLE IF EXISTS MESSAGES';
    // res = await pool.query(text);

}

async function initDB() {
    let text = "CREATE TABLE IF NOT EXISTS USERS (id SERIAL,username varchar(255) NOT NULL,password varchar(255) NOT NULL,icon varchar(255),lvl int DEFAULT 1,birds int DEFAULT 0, maxbirds int DEFAULT 10,maxseeds int DEFAULT 200, maxdroppings int DEFAULT 200,maxexpeditions int DEFAULT 3, seeds int DEFAULT 10,seedsminute int DEFAULT 30, droppings int DEFAULT 0, totaldroppingsminute int DEFAULT 0, feathers int DEFAULT 0,xcoord NUMERIC(10,4) DEFAULT 0, ycoord NUMERIC(10,4) DEFAULT 0, lastupdate bigint NOT NULL,farmlvl int DEFAULT 0,aviarylvl int DEFAULT 0,farmstoragelvl int DEFAULT 0, droppingsstoragelvl int DEFAULT 0,totalspentseeds int DEFAULT 0, totalspentdroppings int DEFAULT 0, totalspentfeathers int DEFAULT 0,hasnotifications boolean DEFAULT false,istravelling boolean DEFAULT false,nextpossibleattack bigint DEFAULT 0,protecteduntil bigint DEFAULT 0,militaryscore int DEFAULT 0,totalattacks int DEFAULT 0,totaldefenses int DEFAULT 0,creationtime bigint DEFAULT 0, PRIMARY KEY (id));";
    let res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS PIGEONS (id SERIAL, type int NOT NULL,name varchar(255), rank int DEFAULT 1,attack int DEFAULT 1, attackrandomness int default 0, shield int DEFAULT 1,defense int DEFAULT 3,defenserandomness int default 0,energy int,maxenergy int,feedcost int default 10,element int default 0, droppingsminute int DEFAULT 2,feathers int DEFAULT 2,creationtime bigint,attacker boolean default false,defender boolean default false, ownerid int REFERENCES USERS(id),PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS EXPEDITIONS (id SERIAL, type int NOT NULL,lvl int DEFAULT 1, starttime bigint, duration int DEFAULT 15000,finished boolean DEFAULT false, ownerid int REFERENCES USERS(id),PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS LOGS (id SERIAL, userid int, method VARCHAR(255), url VARCHAR(255), body VARCHAR(255),ip VARCHAR(255), date bigint, PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS ERRORS (id SERIAL,errorcode int,details TEXT, date bigint, PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS MESSAGES(id SERIAL,ownerid int, title VARCHAR(255),body TEXT,sender VARCHAR(255), date bigint, PRIMARY KEY (id));'
    res = await pool.query(text);
}

