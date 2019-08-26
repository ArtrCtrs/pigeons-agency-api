import { AchievementsControler } from './controllers/achievements-controler';
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
import { EventControler } from './controllers/event-controler';
import { MerchantControler } from './controllers/merchant-controler';
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

app.get('/api/event', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(EventControler.getEventInfo));
app.post('/api/event', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(EventControler.doEventAction));

app.get('/api/achievements', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(AchievementsControler.getAchievements));
app.post('/api/achievements', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(AchievementsControler.claimAchievement));

app.post('/api/merchant/htf', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(MerchantControler.honorpointsToFeathers));
app.post('/api/merchant/ftd', [MiddlewareHelper.logRequest, MiddlewareHelper.isLoggedIn], wrapAsync(MerchantControler.feathersToDroppings));

app.use(ErrorHelper.clientErrorHandler);

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});