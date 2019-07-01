import { User } from '../entities/User';
import db from '../db/pgpool';
import { Event } from '../entities/event';
import { Message } from '../entities/message';
import { ConnectError } from '../classes/connect-error';
import { Eventuser } from '../entities/eventuser';
import { EventResponse } from '../entities/eventsresponse';
import globalhelper from '../helpers/globals-helper';
import pigeonList from '../lists/pigeonsList';

let pool = db.getPool();

export class EventService {
    static async getEventInfo(user: User): Promise<EventResponse> {
        const tnow = Date.now();
        let text = "SELECT * FROM EVENTS ORDER BY id DESC LIMIT 1";
        let event: Event = (await pool.query(text)).rows[0];

        text = "SELECT eventsplayers.*,users.username,users.honorpoints,users.lvl,users.totaldroppingsminute,users.birds FROM EVENTSPLAYERS LEFT JOIN USERS ON users.id=eventsplayers.userid WHERE eventsplayers.eventid=$1 ORDER BY eventsplayers.stat1 DESC;"
        let eventusers: Eventuser[] = (await pool.query(text, [event.id])).rows;

        switch (event.period) {
            case 0:
                if (event.starttime < tnow) {
                    event.period = 1;
                    text = "UPDATE EVENTS SET period = 1;";
                    await pool.query(text, [])

                    text = "INSERT INTO public.messages(ownerid, title, body, sender, date, isattack)VALUES (-1,'','NEW EVENT','Event info',$1,0);"
                    await pool.query(text, [tnow])
                }
                break;
            case 1:

                if (event.endtime < tnow) {
                    text = "SELECT DISTINCT USERS.lvl,  FIRST_VALUE(EVENTSPLAYERS.id) OVER (PARTITION BY USERS.lvl ORDER BY EVENTSPLAYERS.stat1 DESC)FROM EVENTSPLAYERS LEFT JOIN USERS ON users.id=eventsplayers.userid WHERE EVENTSPLAYERS.eventid=$1;"
                    let bestPerLevel = (await pool.query(text, [event.id])).rows;

                    text = "UPDATE EVENTS SET period = 2;";
                    await pool.query(text, [])

                    event.period = 2;
                    let prize = 7;
                    const nbrplayers = eventusers.length;
                    for (let i = 0; i < nbrplayers; i++) {
                        if (i < 3) {
                            prize = i + 1;
                        } else if (i <= nbrplayers / 10) {
                            prize = 4;
                        } else if (i <= nbrplayers / 3) {
                            prize = 5;
                        } else if (i <= nbrplayers / 2) {
                            prize = 6;
                        } else {
                            prize = 7;
                        }
                        if (bestPerLevel.some((ev: { id: number; }) => ev.id === eventusers[i].id) && prize > 4) {
                            prize = 4;
                        }
                        let pigeontype;
                        let pigeonattack;
                        let pigeondefense;
                        let pigeonshield = 5;
                        let pigeondroppings;
                        let newhonorpoints;
                        switch (prize) {
                            case 1:
                                pigeontype = eventusers[i].lvl * 5;
                                pigeonattack = pigeonList[pigeontype].attack + pigeonList[pigeontype].attackvariance + 7;
                                pigeondefense = pigeonList[pigeontype].defense + pigeonList[pigeontype].defensevariance;
                                pigeondroppings = pigeonList[pigeontype].droppingsminute + pigeonList[pigeontype].droppingsminutevariance;
                                pigeondroppings = Math.round(pigeondroppings + pigeondroppings / 5);
                                pigeonshield = 6;
                                newhonorpoints = 100;

                                break;
                            case 2:
                                pigeontype = eventusers[i].lvl * 5;
                                pigeonattack = pigeonList[pigeontype].attack + pigeonList[pigeontype].attackvariance + 4;
                                pigeondefense = pigeonList[pigeontype].defense + pigeonList[pigeontype].defensevariance;
                                pigeondroppings = pigeonList[pigeontype].droppingsminute + pigeonList[pigeontype].droppingsminutevariance;
                                pigeondroppings = Math.round(pigeondroppings + pigeondroppings / 8);
                                newhonorpoints = 60;
                                break;
                            case 3:
                                pigeontype = eventusers[i].lvl * 5;
                                pigeonattack = pigeonList[pigeontype].attack + pigeonList[pigeontype].attackvariance + 2;
                                pigeondefense = pigeonList[pigeontype].defense + pigeonList[pigeontype].defensevariance;
                                pigeondroppings = pigeonList[pigeontype].droppingsminute + pigeonList[pigeontype].droppingsminutevariance;
                                pigeondroppings = Math.round(pigeondroppings + pigeondroppings / 14);
                                newhonorpoints = 40;
                                break;
                            case 4:
                                pigeontype = eventusers[i].lvl * 5;
                                pigeonattack = pigeonList[pigeontype].attack + pigeonList[pigeontype].attackvariance;
                                pigeondefense = pigeonList[pigeontype].defense + pigeonList[pigeontype].defensevariance;
                                pigeondroppings = pigeonList[pigeontype].droppingsminute + pigeonList[pigeontype].droppingsminutevariance;
                                newhonorpoints = 30;
                                break;
                            case 5:
                                pigeontype = eventusers[i].lvl * 5;
                                pigeonattack = pigeonList[pigeontype].attack;
                                pigeondefense = pigeonList[pigeontype].defense;
                                pigeondroppings = pigeonList[pigeontype].droppingsminute;
                                newhonorpoints = 20;
                                break;
                            case 6:
                                pigeontype = eventusers[i].lvl * 5;
                                pigeonattack = pigeonList[pigeontype].attack - pigeonList[pigeontype].attackvariance;
                                pigeondefense = pigeonList[pigeontype].defense - pigeonList[pigeontype].defensevariance;
                                pigeondroppings = pigeonList[pigeontype].droppingsminute - pigeonList[pigeontype].droppingsminutevariance;
                                newhonorpoints = 10;
                                break;
                            case 7:
                                pigeontype = eventusers[i].lvl * 5 - 1;
                                pigeonattack = pigeonList[pigeontype].attack + pigeonList[pigeontype].attackvariance;
                                pigeondefense = pigeonList[pigeontype].defense + pigeonList[pigeontype].defensevariance;
                                pigeondroppings = pigeonList[pigeontype].droppingsminute + pigeonList[pigeontype].droppingsminutevariance;
                                newhonorpoints = 5;
                                break;
                        }
                        const text = "INSERT INTO PIGEONS(type,name,rank,attack,attackrandomness,shield,defense,defenserandomness,droppingsminute,feathers,energy,maxenergy,element,feedcost,creationtime,ownerid,nickname) VALUES  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)";
                        await pool.query(text, [pigeontype, pigeonList[pigeontype].name, pigeonList[pigeontype].rank, pigeonattack, pigeonList[pigeontype].attackrandomness, pigeonshield, pigeondefense, pigeonList[pigeontype].defenserandomness, pigeondroppings, pigeonList[pigeontype].feathers, pigeonList[pigeontype].energy, pigeonList[pigeontype].energy, pigeonList[pigeontype].element, pigeonList[pigeontype].feedcost, tnow, eventusers[i].userid, "Event Pigeon"]);

                        const text2 = "UPDATE users SET birds=$1,totaldroppingsminute=$2,honorpoints=$3 where id=$4;";
                        await pool.query(text2, [eventusers[i].birds + 1, eventusers[i].totaldroppingsminute + pigeondroppings, eventusers[i].honorpoints + newhonorpoints, eventusers[i].userid]);
                    }
                    break;
                }
        }
        const eventresp: EventResponse = { "event": event, "users": eventusers, "userid": user.id };

        return eventresp;
    }

    static async doEventAction(user: User): Promise<EventResponse> {
        let eventresp: EventResponse = await this.getEventInfo(user);
        const tnow = Date.now();

        if (eventresp.event.period != 1) {
            globalhelper.setExpFalse();
            throw new ConnectError('EVENT_REQUIREMENTS');
        }
        let thiseventuser = null;
        for (let i = 0; i < eventresp.users.length; i++) {
            if (user.id == eventresp.users[i].userid) {
                thiseventuser = eventresp.users[i];
            }
        }
        let timeToNextAction = 60 * 60 * 1000;

        if (thiseventuser != null) {
            if (thiseventuser.nextactiontime > tnow) {
                globalhelper.setExpFalse();
                throw new ConnectError('EVENT_REQUIREMENTS');
            }
            const attack = await this.getAttack(eventresp.event.type, user.id);

            thiseventuser.stat1 = +thiseventuser.stat1 + +attack;
            thiseventuser.stat2 = +thiseventuser.stat2 + 1;
            thiseventuser.lastactiontime = tnow;
            thiseventuser.nextactiontime = tnow + timeToNextAction;

            const text2 = "UPDATE EVENTSPLAYERS SET stat1 = $1,stat2=$2,lastactiontime=$3,nextactiontime=$4  WHERE id =$5;";
            await pool.query(text2, [thiseventuser.stat1, thiseventuser.stat2, thiseventuser.lastactiontime, thiseventuser.nextactiontime, thiseventuser.id]);

            for (let i = 0; i < eventresp.users.length; i++) {
                if (user.id == eventresp.users[i].userid) {
                    eventresp.users[i] = thiseventuser;
                }
            }
        } else {
            const attack = await this.getAttack(eventresp.event.type, user.id);

            const text2 = "INSERT INTO EVENTSPLAYERS(userid,eventid,lastactiontime,nextactiontime,stat1,stat2) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
            thiseventuser = (await pool.query(text2, [user.id, eventresp.event.id, tnow, tnow + timeToNextAction, attack, 1])).rows[0];
            thiseventuser.username = user.username;
            thiseventuser.honorpoints = user.honorpoints;
            thiseventuser.lvl = user.lvl;
            eventresp.users.push(thiseventuser);
        }
        return eventresp;
    }

    static async getAttack(eventtype: number, userid: number): Promise<number> {
        let attack = 0;
        let eventtext;
        switch (eventtype) {
            case 1: //attack with all pigeons
                eventtext = "SELECT SUM(attack) FROM PIGEONS WHERE ownerid=$1 ";
                attack = (await pool.query(eventtext, [userid])).rows[0].sum;
                break;
            case 2: //attack with bottom 10 pigeons
                eventtext = "SELECT sum(attack) from (SELECT attack from PIGEONS WHERE ownerid=$1 order by attack ASC limit 10) as subt;"
                attack = (await pool.query(eventtext, [userid])).rows[0].sum;
                break;
            case 3: //top 10 shield
                eventtext = "SELECT sum(shield) from (SELECT shield from PIGEONS WHERE ownerid=$1 order by shield DESC limit 10) as subt;"
                attack = (await pool.query(eventtext, [userid])).rows[0].sum;
                break;
        }
        return attack;
    }
}
