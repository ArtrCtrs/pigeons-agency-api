import { User } from './../entities/User';
import db from '../db/pgpool';
import { Pigeon } from '../entities/pigeon';
import { MessageService } from './message-service';
import { Message } from '../entities/message';
import { ConnectError } from '../classes/connect-error';
let pool = db.getPool();

export class AttackService {
    static async attackPlayer(attacker: User, defenderid: number) {
        let text = "SELECT * FROM USERS WHERE id=$1";
        let defender: User = (await pool.query(text, [defenderid])).rows[0];
        if (!defender) {
            throw new ConnectError('INVALID_PARAMETERS');
        }
        if (defender.protecteduntil > Date.now()) {
            throw new ConnectError('REQUIREMENTS_ERROR');
        }
        let message: Message;
        let messagebody = "";
        let attacktotal = 0;
        let defensetotal = 0;
        let shieldtotal = 0;

        text = "SELECT * FROM Pigeons WHERE ownerid=$1 AND attacker=true"
        let attackingPigeons: Pigeon[] = (await pool.query(text, [attacker.id])).rows;
        text = "SELECT * FROM Pigeons WHERE ownerid=$1 AND defender=true"
        let defendingPigeons: Pigeon[] = (await pool.query(text, [defender.id])).rows;

        attackingPigeons.forEach(p => {
            const currentattack = p.attack + (Math.round(Math.random() * 2 * p.attackrandomness - p.attackrandomness));
            attacktotal += currentattack;
            messagebody += p.name + " has attacked for " + currentattack + "<br>";
        });
        defendingPigeons.forEach(p => {
            const currentdefense = p.defense + (Math.round(Math.random() * 2 * p.defenserandomness - p.defenserandomness));
            defensetotal += currentdefense;
            shieldtotal += p.shield;
            messagebody += p.name + " has defended for " + currentdefense + "<br>";
        });


        const diff = Math.abs(attacker.militaryscore - defender.militaryscore);
        const higherscore = attacker.militaryscore > defender.militaryscore;
        let attackerwonpoints;
        let defenderwonpoints;
        let stolenFeathers = 0;


        if (attacktotal > defensetotal) {
            attackerwonpoints = 1 + Math.round((20 - diff) / 4);
            if (!higherscore) {
                attackerwonpoints++;
            }
            defenderwonpoints = -(1 + Math.round((20 - diff) / 6));

            stolenFeathers = defender.feathers * (0.3 + 0.01 * shieldtotal);



        } else {
            attackerwonpoints = -(1 + Math.round((20 - diff) / 6));
            defenderwonpoints = (1 + Math.round((20 - diff) / 5));
            if (higherscore) {
                defenderwonpoints++;
            }
        }
        messagebody += "<br>" + (attacktotal > defensetotal ? "attacker " + attacker.username + " has won!" : "defender " + defender.username + " has won! <br>");
        messagebody += "Scores : " + attacktotal + " attack vs " + defensetotal + " defense and " + shieldtotal + " shield<br>";
        messagebody += "Stolen feathers : " + stolenFeathers + "<br>";
        messagebody += "Attacker got  : " + attackerwonpoints + " points<br>";
        messagebody += "Defender got  : " + defenderwonpoints + " points<br>";

        text = "UPDATE USERS SET militaryscore = $1,nextpossibleattack=$2,protecteduntil=$3,feathers=$4  WHERE id =$5 ";
        const newattackkscore = (attacker.militaryscore + attackerwonpoints) > 0 ? (attacker.militaryscore + attackerwonpoints) : 0;
        await pool.query(text, [newattackkscore, Date.now() + (1000 * 60), Date.now(), attacker.feathers + stolenFeathers, attacker.id]);

        const newdefensescore = (defender.militaryscore + defenderwonpoints) > 0 ? (defender.militaryscore + defenderwonpoints) : 0;
        text = "UPDATE USERS SET militaryscore = $1,protecteduntil=$2,feathers=$3  WHERE id =$4 ";
        await pool.query(text, [newdefensescore, Date.now() + (15000 * 60), defender.feathers - stolenFeathers, defender.id]);


        message = { ownerid: defender.id, title: "Your have been attacked by " + attacker.username, body: messagebody, sender: "info" };
        await MessageService.createMessage(message);

        message = { ownerid: attacker.id, title: "You have attacked " + defender.username, body: messagebody, sender: "info" };
        await MessageService.createMessage(message);

    }
}