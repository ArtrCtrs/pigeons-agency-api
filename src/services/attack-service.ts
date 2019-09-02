import { User } from './../entities/User';
import db from '../db/pgpool';
import { Pigeon } from '../entities/pigeon';
import { MessageService } from './message-service';
import { UsersService } from './users-service';
import { Message } from '../entities/message';
import { ConnectError } from '../classes/connect-error';
import globalhelper from '../helpers/globals-helper';

let pool = db.getPool();

export class AttackService {
    static async attackPlayer(attacker: User, defenderid: number) {
        let text = "SELECT * FROM USERS WHERE id=$1";
        let defender: User = (await pool.query(text, [defenderid])).rows[0];
        if (!defender) {
            globalhelper.setExpFalse();
            throw new ConnectError('USER_NOT_FOUND');
        }
        if (defender.protecteduntil > Date.now()) {
            globalhelper.setExpFalse();
            throw new ConnectError('ATTACK_REQUIREMENTS');
        }
        if (attacker.lastattack == defender.id) {
            globalhelper.setExpFalse();
            throw new ConnectError('ATTACK_REQUIREMENTS');
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

        messagedetails += "<b>Attackers</b><br>"
        attackingPigeons.forEach(p => {
            const currentattack = p.attack + (Math.round(Math.random() * 2 * p.attackrandomness - p.attackrandomness));
            attacktotal += currentattack;
            messagedetails += "Lvl " + this.typeToLvl(p.type) + " " + this.rankToText(p.rank) + " : atk " + currentattack + "<br>";
        });
        messagedetails += "<b>Defenders</b><br>";
        defendingPigeons.forEach(p => {
            const currentdefense = p.defense + (Math.round(Math.random() * 2 * p.defenserandomness - p.defenserandomness));
            defensetotal += currentdefense;
            shieldtotal += p.shield;
            messagedetails += "Lvl " + this.typeToLvl(p.type) + " " + this.rankToText(p.rank) + " : def " + currentdefense + "<br>";
        });


        const diff = Math.abs(attacker.militaryscore - defender.militaryscore);
        const higherscore = attacker.militaryscore > defender.militaryscore;
        let attackerwonpoints;
        let defenderwonpoints;
        let stolenFeathers = 0;
        let stolenDroppings = 0;
        let defenderwon = 0;
        let attackerwon = 0;


        if (attacktotal >= defensetotal) {
            attackerwon = 1;
            if (!higherscore) {
                attackerwonpoints = 7;
                defenderwonpoints = -6;
            } else {
                attackerwonpoints = (7 - Math.round(diff / 5)) > 0 ? (7 - Math.round(diff / 5)) : 0;
                defenderwonpoints = (6 - Math.round(diff / 5)) > 0 ? -(6 - Math.round(diff / 5)) : 0;
            }
            stolenFeathers = Math.round(defender.feathers * (0.3 - 0.01 * shieldtotal) * attackerwonpoints / 7);
            stolenDroppings = Math.round(((defender.droppings / 100) + (defender.maxdroppings * 0.5 / 100) / 2 * 1.2) * attackerwonpoints / 7);
            // const attackerDroppingsSpace = (attacker.maxdroppings - attacker.droppings);
            // stolenDroppings = potentialStolenDroppings < attackerDroppingsSpace ? potentialStolenDroppings : attackerDroppingsSpace;
            stolenDroppings = stolenDroppings > defender.droppings ? defender.droppings : stolenDroppings;


        } else {
            defenderwon = 1;
            if (higherscore) {
                attackerwonpoints = -5;
                defenderwonpoints = 6;
            } else {
                attackerwonpoints = (5 - Math.round(diff / 6)) > 0 ? -(5 - Math.round(diff / 6)) : 0;
                defenderwonpoints = (6 - Math.round(diff / 6)) > 0 ? (6 - Math.round(diff / 6)) : 0;
            }
            stolenFeathers = -Math.round(attacker.feathers * (0.3 - 0.01 * shieldtotal) * 0.5);
            stolenDroppings = Math.round(((attacker.droppings / 100) + (attacker.maxdroppings * 0.25 / 100) / 2) * 0.8);
            // const defenderDroppingsSpace = (defender.maxdroppings - defender.droppings);
            // stolenDroppings = potentialStolenDroppings < defenderDroppingsSpace ? potentialStolenDroppings : defenderDroppingsSpace;
            stolenDroppings = stolenDroppings > attacker.droppings ? attacker.droppings : stolenDroppings;
            stolenDroppings = -stolenDroppings;

        }
        // messagebody += "<br>" + (attacktotal > defensetotal ? "<strong>Attacker " + attacker.username + " has won !</strong> <br>" : "<strong>Defender " + defender.username + " has won !</strong> <br>");
        // messagebody += "Results : " + attacktotal + " total attack vs " + defensetotal + " total defense.<br>";
        // messagebody += "Stolen feathers : " + stolenFeathers + "  (shield total : " + shieldtotal + " )<br>";
        // messagebody += "Attacker military score got  : " + attackerwonpoints + " points<br>";
        // messagebody += "Defender military score got  : " + defenderwonpoints + " points<br>";

        messagebody += "<br>" + messagedetails + "";

        text = "UPDATE USERS SET militaryscore = $1,nextpossibleattack=$2,protecteduntil=$3,feathers=$4,totalattacks=$5,droppings=$6,lastattack=$7,totalwinattacks=$8  WHERE id =$9 ";
        const newattackscore = (attacker.militaryscore + attackerwonpoints) > 0 ? (attacker.militaryscore + attackerwonpoints) : 0;
        await pool.query(text, [newattackscore, Date.now() + (1500 * 60), Date.now(), attacker.feathers + stolenFeathers, attacker.totalattacks + 1, attacker.droppings + stolenDroppings, defender.id, attacker.totalwinattacks + attackerwon, attacker.id]);

        const newdefensescore = (defender.militaryscore + defenderwonpoints) > 0 ? (defender.militaryscore + defenderwonpoints) : 0;
        text = "UPDATE USERS SET militaryscore = $1,protecteduntil=$2,feathers=$3,totaldefenses=$4,droppings=$5,totalwindefenses=$6  WHERE id =$7 ";
        await pool.query(text, [newdefensescore, Date.now() + (20000 * 60), defender.feathers - stolenFeathers, defender.totaldefenses + 1, defender.droppings - stolenDroppings, defender.totalwindefenses + defenderwon, defender.id]);


        message = {
            ownerid: defender.id,
            title: "You have been attacked by " + attacker.username,
            body: messagebody,
            sender: "info",
            isattack: 2,
            iswin: attacktotal >= defensetotal ? 2 : 1,
            attackvalue: attacktotal,
            defensevalue: defensetotal,
            shieldvalue: shieldtotal,
            stolenfeathers: stolenFeathers,
            myscore: newdefensescore,
            opponentscore: newattackscore,
            mynewpoints: defenderwonpoints,
            opponentnewpoints: attackerwonpoints,
            stolenDroppings: stolenDroppings


        };
        await MessageService.createMessage(message);

        message = {
            ownerid: attacker.id,
            title: "You have attacked " + defender.username,
            body: messagebody,
            sender: "info",
            isattack: 1,
            iswin: attacktotal >= defensetotal ? 1 : 2,
            attackvalue: attacktotal,
            defensevalue: defensetotal,
            shieldvalue: shieldtotal,
            stolenfeathers: stolenFeathers,
            myscore: newattackscore,
            opponentscore: newdefensescore,
            mynewpoints: attackerwonpoints,
            opponentnewpoints: defenderwonpoints,
            stolenDroppings: stolenDroppings
        };
        await MessageService.createMessage(message);

    }
    static rankToText(rank: number): String {
        let text = "";
        switch (rank) {
            case 1:
                text = "Common"
                break;
            case 2:
                text = "Uncommon"
                break;
            case 3:
                text = "Rare"
                break;
            case 4:
                text = "Epic"
                break;
            case 5:
                text = "Legendary"
                break;
            case -1:
                text = "Event"
                break;
        }
        return text;

    }
    static typeToLvl(type: number): number {
        let lvl = 0;
        if (type > 0 && type <= 150) {
            lvl = Math.floor((type - 1) / 5) + 1
        } else if (type > 150 && type <= 300) {
            lvl = Math.floor((type - 151) / 5) + 1
        }
        return lvl;

    }
}

