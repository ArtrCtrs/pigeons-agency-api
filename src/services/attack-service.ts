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

        text = "SELECT * FROM Pigeons WHERE ownerid=$1"
        let attackingPigeons: Pigeon[] = (await pool.query(text, [attacker.id])).rows;
        let defendingPigeons: Pigeon[] = (await pool.query(text, [defender.id])).rows;

        attackingPigeons.forEach(p => {
            attacktotal += p.attack;
            messagebody += p.name + " has attacked for " + p.attack + "<br>";
        });
        defendingPigeons.forEach(p => {
            defensetotal += p.defense;
            messagebody += p.name + " has defended for " + p.attack + "<br>";
        });

        text = "UPDATE USERS SET militaryscore = $1,nextpossibleattack=$2,protecteduntil=$3  WHERE id =$4 ";
        await pool.query(text, [attacker.militaryscore + 1, Date.now() + 15000, Date.now(), attacker.id]);

        text = "UPDATE USERS SET militaryscore = $1,protecteduntil=$2  WHERE id =$3 ";
        await pool.query(text, [attacker.militaryscore + 1, Date.now() + 5000, defender.id]);

        messagebody += "<br>" + (attacktotal > defensetotal ? "attacker " + attacker.username + " has won!" : "defender " + defender.username + " has won!");

        message = { ownerid: defender.id, title: "Your have been attacked by " + attacker.username, body: messagebody, sender: "info" };
        await MessageService.createMessage(message);

        message = { ownerid: attacker.id, title: "You have attacked " + defender.username, body: messagebody, sender: "info" };
        await MessageService.createMessage(message);

    }
}