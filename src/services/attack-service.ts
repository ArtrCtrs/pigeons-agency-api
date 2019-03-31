import { User } from './../entities/User';
import db from '../db/pgpool';
import { Pigeon } from '../entities/pigeon';
import { MessageService } from './message-service';
import { UsersService } from './users-service';
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
        UsersService.updateUserInfo(defender);
        defender = (await pool.query(text, [defenderid])).rows[0];

        let message: Message;
        let messagebody = "";
        let attacktotal = 0;
        let defensetotal = 0;
        let shieldtotal = 0;
        let messagedetails = "";

        text = "SELECT * FROM Pigeons WHERE ownerid=$1 AND attacker=true"
        let attackingPigeons: Pigeon[] = (await pool.query(text, [attacker.id])).rows;
        text = "SELECT * FROM Pigeons WHERE ownerid=$1 AND defender=true"
        let defendingPigeons: Pigeon[] = (await pool.query(text, [defender.id])).rows;

        attackingPigeons.forEach(p => {
            const currentattack = p.attack + (Math.round(Math.random() * 2 * p.attackrandomness - p.attackrandomness));
            attacktotal += currentattack;
            messagedetails += p.name + " rank " + p.rank + " has attacked for " + currentattack + "<br>";
        });
        defendingPigeons.forEach(p => {
            const currentdefense = p.defense + (Math.round(Math.random() * 2 * p.defenserandomness - p.defenserandomness));
            defensetotal += currentdefense;
            shieldtotal += p.shield;
            messagedetails += p.name + " rank " + p.rank + " has defended for " + currentdefense + "<br>";
        });


        const diff = Math.abs(attacker.militaryscore - defender.militaryscore);
        const higherscore = attacker.militaryscore > defender.militaryscore;
        let attackerwonpoints;
        let defenderwonpoints;
        let stolenFeathers = 0;
        let stolenDroppings = 0;


        if (attacktotal > defensetotal) {
            if (!higherscore) {
                attackerwonpoints = 7;
                defenderwonpoints = -6;
            } else {
                attackerwonpoints = (7 - Math.round(diff / 5)) > 0 ? (7 - Math.round(diff / 5)) : 0;
                defenderwonpoints = (6 - Math.round(diff / 5)) > 0 ? -(6 - Math.round(diff / 5)) : 0;
            }
            stolenFeathers = Math.round(defender.feathers * (0.3 - 0.01 * shieldtotal));
            const potentialStolenfeathers = Math.round(defender.droppings / 100);
            const attackerDroppingsSpace = (attacker.maxdroppings - attacker.droppings);
            stolenDroppings = potentialStolenfeathers < attackerDroppingsSpace ? potentialStolenfeathers : attackerDroppingsSpace;


        } else {
            if (higherscore) {
                attackerwonpoints = -5;
                defenderwonpoints = 6;
            } else {
                attackerwonpoints = (5 - Math.round(diff / 6)) > 0 ? -(5 - Math.round(diff / 6)) : 0;
                defenderwonpoints = (6 - Math.round(diff / 6)) > 0 ? (6 - Math.round(diff / 6)) : 0;
            }

        }
        // messagebody += "<br>" + (attacktotal > defensetotal ? "<strong>Attacker " + attacker.username + " has won !</strong> <br>" : "<strong>Defender " + defender.username + " has won !</strong> <br>");
        // messagebody += "Results : " + attacktotal + " total attack vs " + defensetotal + " total defense.<br>";
        // messagebody += "Stolen feathers : " + stolenFeathers + "  (shield total : " + shieldtotal + " )<br>";
        // messagebody += "Attacker military score got  : " + attackerwonpoints + " points<br>";
        // messagebody += "Defender military score got  : " + defenderwonpoints + " points<br>";

        messagebody += "<br>Details : <br>" + messagedetails + "";

        text = "UPDATE USERS SET militaryscore = $1,nextpossibleattack=$2,protecteduntil=$3,feathers=$4,totalattacks=$5,droppings=$6  WHERE id =$7 ";
        const newattackkscore = (attacker.militaryscore + attackerwonpoints) > 0 ? (attacker.militaryscore + attackerwonpoints) : 0;
        await pool.query(text, [newattackkscore, Date.now() + (1000 * 60), Date.now(), attacker.feathers + stolenFeathers, attacker.totalattacks + 1, attacker.droppings + stolenDroppings, attacker.id]);

        const newdefensescore = (defender.militaryscore + defenderwonpoints) > 0 ? (defender.militaryscore + defenderwonpoints) : 0;
        text = "UPDATE USERS SET militaryscore = $1,protecteduntil=$2,feathers=$3,totaldefenses=$4,droppings=$5  WHERE id =$6 ";
        await pool.query(text, [newdefensescore, Date.now() + (15000 * 60), defender.feathers - stolenFeathers, defender.totaldefenses + 1, defender.droppings - stolenDroppings, defender.id]);


        message = {
            ownerid: defender.id,
            title: "You have been attacked by " + attacker.username,
            body: messagebody,
            sender: "info",
            isattack: 2,
            iswin: attacktotal > defensetotal ? 2 : 1,
            attackvalue: attacktotal,
            defensevalue: defensetotal,
            shieldvalue: shieldtotal,
            stolenfeathers: stolenFeathers,
            myscore: newdefensescore,
            opponentscore: newattackkscore,
            mynewpoints: defenderwonpoints,
            opponentnewpoints: attackerwonpoints,
            stolenDroppings:stolenDroppings


        };
        await MessageService.createMessage(message);

        message = {
            ownerid: attacker.id,
            title: "You have attacked " + defender.username,
            body: messagebody,
            sender: "info",
            isattack: 1,
            iswin: attacktotal > defensetotal ? 1 : 2,
            attackvalue: attacktotal,
            defensevalue: defensetotal,
            shieldvalue: shieldtotal,
            stolenfeathers: stolenFeathers,
            myscore: newattackkscore,
            opponentscore: newdefensescore,
            mynewpoints: attackerwonpoints,
            opponentnewpoints: defenderwonpoints,
            stolenDroppings:stolenDroppings
        };
        await MessageService.createMessage(message);

    }
}