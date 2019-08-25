import { User } from './../entities/User';
import aviaryUpgradesList from '../lists/aviaryUpgradesList';
import seedsUpgradesList from '../lists/seedsUpgradesList';
import seedsStorageList from '../lists/seedsStorageList';
import droppingsStorageList from '../lists/droppingsStorageList';
import db from '../db/pgpool';
let pool = db.getPool();

export class upgradesService {
    static async upgradeFarm(user: User) {
        const featherscost = seedsUpgradesList[user.farmlvl + 1].feathersCost;
        if (user.aviarylvl == user.lvl && user.farmstoragelvl == user.lvl && user.droppingsstoragelvl == user.lvl) {
            user.lvl++;
        }
        const text = "UPDATE USERS SET seedsminute = $1,feathers=$2,farmlvl=$3,totalspentfeathers=$4,lvl=$5  WHERE id =$6;";
        await pool.query(text, [seedsUpgradesList[user.farmlvl + 1].newSeeds, user.feathers - featherscost, user.farmlvl + 1, user.totalspentfeathers + featherscost, user.lvl, user.id]);

    }
    static async upgradeAviary(user: User) {
        const droppingscost = aviaryUpgradesList[user.aviarylvl + 1].droppingsCost;
        if (user.farmstoragelvl == user.lvl && user.farmlvl == user.lvl && user.droppingsstoragelvl == user.lvl) {
            user.lvl++;
        }
        const text = "UPDATE USERS SET maxbirds = $1,droppings=$2 ,aviarylvl=$3, totalspentdroppings=$4,lvl=$5 WHERE id =$6;";
        await pool.query(text, [aviaryUpgradesList[user.aviarylvl + 1].newBirds, user.droppings - droppingscost, user.aviarylvl + 1, user.totalspentdroppings + droppingscost, user.lvl, user.id]);

    }
    static async upgradeFarmStorage(user: User) {
        const seedsCost = seedsStorageList[user.farmstoragelvl + 1].seedsCost;
        const featherscost = seedsStorageList[user.farmstoragelvl + 1].feathersCost;
        if (user.aviarylvl == user.lvl && user.farmlvl == user.lvl && user.droppingsstoragelvl == user.lvl) {
            user.lvl++;
        }
        const text = "UPDATE USERS SET maxseeds = $1,seeds=$2, feathers=$3, farmstoragelvl=$4,totalspentseeds=$5, totalspentfeathers=$6,lvl=$7  WHERE id =$8;";
        await pool.query(text, [seedsStorageList[user.farmstoragelvl + 1].seedsStorage, user.seeds - seedsCost, user.feathers - featherscost, user.farmstoragelvl + 1, user.totalspentseeds + seedsCost, user.totalspentfeathers + featherscost, user.lvl, user.id]);

    }
    static async upgradeDroppingsStorage(user: User) {
        const droppingsCost = droppingsStorageList[user.droppingsstoragelvl + 1].droppingsCost;
        const featherscost = droppingsStorageList[user.droppingsstoragelvl + 1].feathersCost;
        if (user.aviarylvl == user.lvl && user.farmstoragelvl == user.lvl && user.farmlvl == user.lvl) {
            user.lvl++;
        }
        const text = "UPDATE USERS SET maxdroppings = $1,droppings=$2, feathers=$3, droppingsstoragelvl=$4,totalspentdroppings=$5, totalspentfeathers=$6,lvl=$7  WHERE id =$8;";
        await pool.query(text, [droppingsStorageList[user.droppingsstoragelvl + 1].droppingsStorage, user.droppings - droppingsCost, user.feathers - featherscost, user.droppingsstoragelvl + 1, user.totalspentdroppings + droppingsCost, user.totalspentfeathers + featherscost, user.lvl, user.id]);

    }
}