import db from '../db/pgpool';
import expeditionsList from '../model/expeditionsList';
import pigeonList from '../model/pigeonsList';
let pool = db.getPool();

export class PigeonsService {

    static async getPigeons(id: number): Promise<string> {
        const text = "SELECT * FROM PIGEONS WHERE ownerid=$1;";
        const dbres = await pool.query(text, [id]);
        return dbres.rows;

    }

    static async addPigeon(id: number, expeditiontype: number) {
        const random = Math.random() * 100;
        let i = 0;
        while (random > expeditionsList[expeditiontype].reward[i].probability) {
            i++;
        }
        const pigeonid = expeditionsList[expeditiontype].reward[i].pigeontype;

        const attackdiff = Math.round(Math.random() * pigeonList[pigeonid].attackvariance * 2 - pigeonList[pigeonid].attackvariance);
        const pigeonattack = pigeonList[pigeonid].attack + attackdiff;

        const defensediff = Math.round(Math.random() * pigeonList[pigeonid].defensevariance * 2 - pigeonList[pigeonid].defensevariance);
        const pigeondefense = pigeonList[pigeonid].defense + defensediff;

        const lifediff = Math.round(Math.random() * pigeonList[pigeonid].lifevariance * 2 - pigeonList[pigeonid].lifevariance);
        const pigeonlife = pigeonList[pigeonid].life + lifediff;

        const droppingsdiff = Math.round(Math.random() * pigeonList[pigeonid].droppingsminutevariance * 2 - pigeonList[pigeonid].droppingsminutevariance);
        const pigeondroppings = pigeonList[pigeonid].droppingsminute + droppingsdiff;




        const text = "INSERT INTO PIGEONS(type,lvl,attack,defense,life,droppingsminute,wings,ownerid) VALUES  ($1,$2,$3,$4,$5,$6,$7,$8)";
        await pool.query(text, [pigeonid, pigeonList[pigeonid].lvl, pigeonattack, pigeondefense, pigeonlife, pigeondroppings, pigeonList[pigeonid].wings, id]);

    }

}
