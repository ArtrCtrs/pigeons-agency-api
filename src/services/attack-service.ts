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
        let message: Message;
        let messagebody = "";
        let attacktotal = 0;
        let defensetotal = 0;

         text = "SELECT * FROM Pigeons WHERE ownerid=$1"
        let attackingPigeons: Pigeon[] = (await pool.query(text, [attacker.id])).rows;
        let defendingPigeons: Pigeon[] = (await pool.query(text, [defender.id])).rows;

        attackingPigeons.forEach(p => {
            attacktotal += p.attack;
            messagebody += p.name + " has attacked for " + p.attack + "\n";
        });
        defendingPigeons.forEach(p => {
            defensetotal += p.defense;
            messagebody += p.name + " has defended for " + p.attack + "\n";
        });

         text="UPDATE USERS SET militaryscore = $1  WHERE id =$2 ";
        await pool.query(text, [attacker.militaryscore+1,attacker.id]);

        let messagetitle = attacktotal > defensetotal ? "attacker " + attacker.username + " has won!" : "defender " + defender.username + " has won!";
        message = { ownerid: defender.id, title: messagetitle, body: messagebody, sender: "info" };

        await MessageService.createMessage(message);


    }
}