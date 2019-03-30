import db from '../db/pgpool';
import expeditionsList from '../lists/expeditionsList';
import pigeonList from '../lists/pigeonsList';
import namesList from '../lists/namesList';
import { User } from '../entities/User';
import { ConnectError } from '../classes/connect-error';
let pool = db.getPool();

export class PigeonsService {

    static async getPigeons(id: number, orderbyid: number): Promise<string> {
        let statement;
        switch (+orderbyid) {
            case 1:
                //newest
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY creationtime desc;"
                break;
            case 2:
                //oldest
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY creationtime asc;"
                break;
            case 3:
                //high attack
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY attack desc,creationtime desc;"
                break;
            case 4:
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY defense desc,creationtime desc;"
                break;
            case 5:
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY rank desc,creationtime desc;"
                break;
            case 6:
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY type desc,creationtime desc;"
                break;
            case 7:
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY droppingsminute desc,creationtime desc;"
                break;
            case 8:
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY attacker desc,creationtime desc;"
                break;
            case 9:
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY defender desc,creationtime desc;"
                break;
            default:
                statement = "SELECT * FROM PIGEONS WHERE ownerid=$1 ORDER BY creationtime desc;"

        }
        const dbres = await pool.query(statement, [id]);
        return dbres.rows;

    }

    static async addPigeon(id: number, expeditiontype: number) {
        const random = Math.random() * 100;
        let i = 0;
        while (random > expeditionsList[expeditiontype].reward[i].probability) {
            i++;
        }
        const pigeontype = expeditionsList[expeditiontype].reward[i].pigeontype;

        const attackdiff = Math.round(Math.random() * pigeonList[pigeontype].attackvariance * 2 - pigeonList[pigeontype].attackvariance);
        const pigeonattack = pigeonList[pigeontype].attack + attackdiff;

        const shielddiff = Math.round(Math.random() * pigeonList[pigeontype].shieldvariance * 2 - pigeonList[pigeontype].shieldvariance);
        const pigeonshield = pigeonList[pigeontype].shield + shielddiff;

        const defensediff = Math.round(Math.random() * pigeonList[pigeontype].defensevariance * 2 - pigeonList[pigeontype].defensevariance);
        const pigeondefense = pigeonList[pigeontype].defense + defensediff;

        const droppingsdiff = Math.round(Math.random() * pigeonList[pigeontype].droppingsminutevariance * 2 - pigeonList[pigeontype].droppingsminutevariance);
        const pigeondroppings = pigeonList[pigeontype].droppingsminute + droppingsdiff;

        const randomname = namesList[(Math.floor(Math.random() * namesList.length))];
        const text = "INSERT INTO PIGEONS(type,name,rank,attack,attackrandomness,shield,defense,defenserandomness,droppingsminute,feathers,energy,maxenergy,element,feedcost,creationtime,ownerid,nickname) VALUES  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)";
        await pool.query(text, [pigeontype, pigeonList[pigeontype].name, pigeonList[pigeontype].rank, pigeonattack, pigeonList[pigeontype].attackrandomness, pigeonshield, pigeondefense, pigeonList[pigeontype].defenserandomness, pigeondroppings, pigeonList[pigeontype].feathers, pigeonList[pigeontype].energy, pigeonList[pigeontype].energy, pigeonList[pigeontype].element, pigeonList[pigeontype].feedcost, Date.now(), id, randomname]);
        await this.updateUser(id, pigeondroppings);

    }
    static async sellPigeon(pigeonid: number) {
        let text = "SELECT ownerid,droppingsminute,feathers FROM PIGEONS WHERE id=$1"
        const pigeon = (await pool.query(text, [pigeonid])).rows[0];
        text = "SELECT totaldroppingsminute,feathers,birds from USERS WHERE id=$1"
        const user = (await pool.query(text, [pigeon.ownerid])).rows[0];
        text = "UPDATE USERS SET totaldroppingsminute = $1,feathers=$2,birds=$3  WHERE id =$4;";
        await pool.query(text, [user.totaldroppingsminute - pigeon.droppingsminute, user.feathers + pigeon.feathers, user.birds - 1, pigeon.ownerid]);
        text = "DELETE FROM PIGEONS WHERE id=$1"
        await pool.query(text, [pigeonid]);
    }

    static async destroyPigeon(pigeonid: number) {
        let text = "SELECT ownerid, droppingsminute FROM PIGEONS WHERE id=$1"
        const pigeon = (await pool.query(text, [pigeonid])).rows[0];
        text = "SELECT totaldroppingsminute,birds from USERS WHERE id=$1"
        const user = (await pool.query(text, [pigeon.ownerid])).rows[0];
        text = "UPDATE USERS SET totaldroppingsminute = $1,birds=$2  WHERE id =$3;";
        await pool.query(text, [user.totaldroppingsminute - pigeon.droppingsminute, user.birds - 1, pigeon.ownerid]);
        text = "DELETE FROM PIGEONS WHERE id=$1"
        await pool.query(text, [pigeonid]);
    }
    static async feedPigeon(user: User, pigeonid: number) {
        let text = 'SELECT feedcost,energy,maxenergy FROM PIGEONS WHERE id=$1';
        const pigeon = (await pool.query(text, [pigeonid])).rows[0];
        const feedcost = pigeonList[pigeon.type].feedcost;
        if (user.seeds < feedcost || pigeon.energy >= pigeon.maxenergy) {
            throw new ConnectError('REQUIREMENTS_ERROR');
        }
        text = 'UPDATE USERS SET seeds = $1 WHERE id = $2';
        await pool.query(text, [user.seeds - feedcost, user.id]);
        text = 'UPDATE PIGEONS SET energy = $1 WHERE id = $2';
        await pool.query(text, [pigeon.energy + 1, pigeonid]);

    }

    static async setDefender(user: User, pigeonid: number) {
        let text = 'SELECT defender FROM Pigeons where id=$1';
        const isDefender = (await pool.query(text, [pigeonid])).rows[0].defender;
        if (!isDefender) {
            text = 'SELECT COUNT(*) FROM PIGEONS WHERE ownerid=$1 AND defender=true';
            const nbrDefs = (await pool.query(text, [user.id])).rows[0].count;
            if (nbrDefs >= 5) {
                throw new ConnectError('REQUIREMENTS_ERROR');
            }
            text = 'UPDATE PIGEONS SET defender = true WHERE id = $1';
            await pool.query(text, [pigeonid]);
        } else if (isDefender) {
            text = 'UPDATE PIGEONS SET defender = false WHERE id = $1';
            await pool.query(text, [pigeonid]);
        }
    }

    static async setAttacker(user: User, pigeonid: number) {
        let text = 'SELECT attacker FROM Pigeons where id=$1';
        const isAttacker = (await pool.query(text, [pigeonid])).rows[0].attacker;
        if (!isAttacker) {
            text = 'SELECT COUNT(*) FROM PIGEONS WHERE ownerid=$1 AND attacker=true';
            const nbrAtks = (await pool.query(text, [user.id])).rows[0].count;
            if (nbrAtks >= 5) {
                throw new ConnectError('REQUIREMENTS_ERROR');
            }
            text = 'UPDATE PIGEONS SET attacker = true WHERE id = $1';
            await pool.query(text, [pigeonid]);
        } else if (isAttacker) {
            text = 'UPDATE PIGEONS SET attacker = false WHERE id = $1';
            await pool.query(text, [pigeonid]);
        }
    }

    static async updateUser(userid: number, droppings: number) {
        let text = "SELECT totaldroppingsminute,birds from USERS WHERE id = $1";
        const user = (await pool.query(text, [userid])).rows[0];

        text = "UPDATE USERS SET totaldroppingsminute = $1,birds=$2  WHERE id =$3;";
        await pool.query(text, [user.totaldroppingsminute + droppings, user.birds + 1, userid]);

    }

}
