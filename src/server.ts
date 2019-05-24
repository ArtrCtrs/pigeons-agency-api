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
    origin: ["http://localhost:4200","http://pigeons.agency","https://pigeons.agency"],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// handleInitDB();
async function handleInitDB() {
    await dropDB();
    await initDB();
}

app.get('/api/expeditions', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(ExpeditionsControler.getExpeditions));
app.post('/api/expeditions', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(ExpeditionsControler.launchExpedition));

// app.get('/api/upgrades', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.getCurrentUpgrades));
app.post('/api/upgrades/farm', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.upgradeFarm));
app.post('/api/upgrades/aviary', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.upgradeAviary));
app.post('/api/upgrades/farmstorage', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.upgradeFarmStorage));
app.post('/api/upgrades/droppingsstorage', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UpgradesControler.upgradeDroppingsStorage));

app.get('/api/user', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.getUpdatedUserInfo));

app.get('/api/pigeons', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.getPigeons));

app.post('/api/pigeons/sell', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.sellPigeon));
//app.post('/api/pigeons/feed', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.feedPigeon));
app.post('/api/pigeons/attacker', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.setAttacker));
app.post('/api/pigeons/defender', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(PigeonsControler.setDefender));

app.post('/api/attack', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(AttackControler.attackPlayer));

app.get('/api/messages', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(MessagesControler.getMessages));
app.post('/api/messages', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(MessagesControler.sendMessage));

app.get('/api/allusers', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.getAllUsers));
app.get('/api/allusers/attacks', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(UsersControler.getUsersForAttacks));

app.post('/api/register', [MiddlewareHelper.logRequest], wrapAsync(AuthentificationControler.register));
app.post('/api/login', [MiddlewareHelper.logRequest], wrapAsync(AuthentificationControler.login));

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
    text = 'DROP TABLE IF EXISTS LOGS';
    res = await pool.query(text);
     text = 'DROP TABLE IF EXISTS ERRORS';
     res = await pool.query(text);
    text = 'DROP TABLE IF EXISTS MESSAGES';
    res = await pool.query(text);

}

async function initDB() {
    let text = "CREATE TABLE IF NOT EXISTS USERS (id SERIAL,username varchar(255) NOT NULL,password varchar(255) NOT NULL,icon varchar(255),lvl int DEFAULT 1,birds int DEFAULT 0, maxbirds int DEFAULT 10,maxseeds int DEFAULT 25, maxdroppings int DEFAULT 30,maxexpeditions int DEFAULT -1, seeds int DEFAULT 0,seedsminute int DEFAULT 60, droppings int DEFAULT 0, totaldroppingsminute int DEFAULT 0, feathers int DEFAULT 0,xcoord NUMERIC(10,4) DEFAULT 0, ycoord NUMERIC(10,4) DEFAULT 0, lastupdate bigint NOT NULL,farmlvl int DEFAULT 0,aviarylvl int DEFAULT 0,farmstoragelvl int DEFAULT 0, droppingsstoragelvl int DEFAULT 0,totalspentseeds int DEFAULT 0, totalspentdroppings int DEFAULT 0, totalspentfeathers int DEFAULT 0,hasnotifications boolean DEFAULT false,istravelling boolean DEFAULT false,nextpossibleattack bigint DEFAULT 0,protecteduntil bigint DEFAULT 0,militaryscore int DEFAULT 0,totalattacks int DEFAULT 0,totaldefenses int DEFAULT 0,creationtime bigint DEFAULT 0,lastattack int DEFAULT -1, PRIMARY KEY (id));";
    let res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS PIGEONS (id SERIAL, type int NOT NULL,name varchar(255), rank int DEFAULT 1,attack int DEFAULT 1, attackrandomness int default 0, shield int DEFAULT 1,defense int DEFAULT 3,defenserandomness int default 0,energy int,maxenergy int,feedcost int default 10,element int default 0, droppingsminute int DEFAULT 2,feathers int DEFAULT 2,creationtime bigint,attacker boolean default false,defender boolean default false,nickname varchar(255) default \'bob\', ownerid int REFERENCES USERS(id),PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS EXPEDITIONS (id SERIAL, type int NOT NULL,lvl int DEFAULT 1, starttime bigint, duration int DEFAULT 15000,finished boolean DEFAULT false, ownerid int REFERENCES USERS(id),PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS LOGS (id SERIAL, userid int, method VARCHAR(255), url VARCHAR(255), body VARCHAR(255),ip VARCHAR(255), date bigint, PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS ERRORS (id SERIAL,errorcode int,details TEXT, date bigint, PRIMARY KEY (id));'
    res = await pool.query(text);

    text = 'CREATE TABLE IF NOT EXISTS MESSAGES(id SERIAL,ownerid int, title VARCHAR(255),body TEXT,sender VARCHAR(255), date bigint, PRIMARY KEY (id));'
    //much alter
    res = await pool.query(text);
}

