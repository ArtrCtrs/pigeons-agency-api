import { HomePageDataAPIReturn } from './../entities/HomePageDataAPIReturn';
import aviaryUpgradesList from '../model/aviaryUpgradesList';
import seedsUpgradesList from '../model/seedsUpgradesList';
import db from '../db/pgpool';
let pool = db.getPool();

export class upgradesService {
    static async upgradeFarm(user: HomePageDataAPIReturn) {
        const droppingscost = seedsUpgradesList[user.farmlvl].droppingsCost;
        const text = "UPDATE USERS SET seedsminute = $1,droppings=$2,farmlvl=$3,totalspentdroppings=$4  WHERE id =$5;";
        await pool.query(text, [seedsUpgradesList[user.farmlvl].newSeeds, user.droppings - droppingscost, user.farmlvl + 1, user.totalspentdroppings + droppingscost, user.id]);

    }
    static async upgradeAviary(user: HomePageDataAPIReturn) {
        const featherscost = aviaryUpgradesList[user.aviarylvl].feathersCost;
        const text = "UPDATE USERS SET maxbirds = $1,feathers=$2 ,aviarylvl=$3, totalspentfeathers=$4 WHERE id =$5;";
        await pool.query(text, [aviaryUpgradesList[user.aviarylvl].newBirds, user.feathers - featherscost, user.aviarylvl + 1, user.totalspentfeathers + featherscost, user.id]);

    }
}