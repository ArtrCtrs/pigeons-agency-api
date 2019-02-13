import { User } from './../entities/User';
import aviaryUpgradesList from '../lists/aviaryUpgradesList';
import seedsUpgradesList from '../lists/seedsUpgradesList';
import seedsStorageList from '../lists/seedsStorageList';
import droppingsStorageList from '../lists/droppingsStorageList';
import db from '../db/pgpool';
let pool = db.getPool();

export class upgradesService {
    static async upgradeFarm(user: User) {
        const droppingscost = seedsUpgradesList[user.farmlvl + 1].droppingsCost;
        const text = "UPDATE USERS SET seedsminute = $1,droppings=$2,farmlvl=$3,totalspentdroppings=$4  WHERE id =$5;";
        await pool.query(text, [seedsUpgradesList[user.farmlvl + 1].newSeeds, user.droppings - droppingscost, user.farmlvl + 1, user.totalspentdroppings + droppingscost, user.id]);

    }
    static async upgradeAviary(user: User) {
        const featherscost = aviaryUpgradesList[user.aviarylvl + 1].feathersCost;
        const text = "UPDATE USERS SET maxbirds = $1,feathers=$2 ,aviarylvl=$3, totalspentfeathers=$4 WHERE id =$5;";
        await pool.query(text, [aviaryUpgradesList[user.aviarylvl + 1].newBirds, user.feathers - featherscost, user.aviarylvl + 1, user.totalspentfeathers + featherscost, user.id]);

    }
    static async upgradeFarmStorage(user: User) {
        const droppingscost = seedsStorageList[user.farmstoragelvl + 1].droppingsCost;
        const featherscost = seedsStorageList[user.farmstoragelvl + 1].feathersCost;
        const text = "UPDATE USERS SET maxseeds = $1,droppings=$2, feathers=$3, farmstoragelvl=$4,totalspentdroppings=$5, totalspentfeathers=$6  WHERE id =$7;";
        console.log(seedsStorageList[user.farmstoragelvl])
        console.log(seedsStorageList[user.farmstoragelvl + 1])
        await pool.query(text, [seedsStorageList[user.farmstoragelvl + 1].seedsStorage, user.droppings - droppingscost, user.feathers - featherscost, user.farmstoragelvl + 1, user.totalspentdroppings + droppingscost, user.totalspentfeathers + featherscost, user.id]);

    }
    static async upgradeDroppingsStorage(user: User) {
        const seedsCost = droppingsStorageList[user.droppingsstoragelvl + 1].seedsCost;
        const featherscost = droppingsStorageList[user.droppingsstoragelvl + 1].feathersCost;
        const text = "UPDATE USERS SET maxdroppings = $1,seeds=$2, feathers=$3, droppingsstoragelvl=$4,totalspentseeds=$5, totalspentfeathers=$6  WHERE id =$7;";
        console.log(droppingsStorageList[user.droppingsstoragelvl])
        console.log(droppingsStorageList[user.droppingsstoragelvl + 1])
        await pool.query(text, [droppingsStorageList[user.droppingsstoragelvl + 1].droppingsStorage, user.seeds - seedsCost, user.feathers - featherscost, user.droppingsstoragelvl + 1, user.totalspentseeds + seedsCost, user.totalspentfeathers + featherscost, user.id]);

    }
}