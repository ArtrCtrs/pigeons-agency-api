import { User } from '../entities/User';
import db from '../db/pgpool';
import { Event } from '../entities/event';
import { Message } from '../entities/message';
import { ConnectError } from '../classes/connect-error';
import { Eventuser } from '../entities/eventuser';
import { EventResponse } from '../entities/eventsresponse';
import globalhelper from '../helpers/globals-helper';

let pool = db.getPool();

export class EventService {
    static async getEventInfo(user: User): Promise<EventResponse> {
        let text = "SELECT * FROM EVENTS ORDER BY id DESC LIMIT 1";
        let event: Event = (await pool.query(text)).rows[0];

        text = "SELECT eventsplayers.*,users.username,users.honorpoints,users.lvl FROM EVENTSPLAYERS LEFT JOIN USERS ON users.id=eventsplayers.userid WHERE eventsplayers.eventid=$1;"
        let eventusers: Eventuser[] = (await pool.query(text, [event.id])).rows;
        switch (event.period) {
            case 0:
                if (event.starttime < Date.now()) {
                    event.period = 1;
                    //send message?
                }
                break;
            case 1:
                if (event.endtime < Date.now()) {
                    event.period = 2;
                    //update infos and give rewards
                }
                break;
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

        let attack = 0;
        let timeToNextAction = 60 * 60 * 1000;
        if (thiseventuser != null) {
            if (thiseventuser.nextactiontime > tnow) {
                globalhelper.setExpFalse();
                throw new ConnectError('EVENT_REQUIREMENTS');
            }
            let eventtext;
            switch (eventresp.event.type) {
                case 1: //attack with all pigeons
                    eventtext = "SELECT SUM(attack) FROM PIGEONS WHERE ownerid=$1";
                    attack = (await pool.query(eventtext, [user.id])).rows[0].sum;
                    break;
                case 2: //attack with bottom 10 pigeons
                    eventtext = "SELECT SUM(attack) FROM PIGEONS WHERE ownerid=$1 ORDER BY attack ASC LIMIT 10";
                    attack = (await pool.query(eventtext, [user.id])).rows[0].sum;
                    break;
                case 3: //top 10 shield
                    eventtext = "SELECT SUM(shield) FROM PIGEONS WHERE ownerid=$1 ORDER BY shield DESC LIMIT 10";
                    attack = (await pool.query(eventtext, [user.id])).rows[0].sum;
                    break;
            }
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
            let eventtext;
            switch (eventresp.event.type) {
                case 1: //attack with all pigeons
                    eventtext = "SELECT SUM(attack) FROM PIGEONS WHERE ownerid=$1 ";
                    attack = (await pool.query(eventtext, [user.id])).rows[0].sum;
                    break;
                case 2: //attack with bottom 10 pigeons
                    eventtext = "SELECT SUM(attack) FROM PIGEONS WHERE ownerid=$1 ORDER BY attack ASC LIMIT 10";
                    attack = (await pool.query(eventtext, [user.id])).rows[0].sum;
                    break;
                case 3: //top 10 shield
                    eventtext = "SELECT SUM(shield) FROM PIGEONS WHERE ownerid=$1 ORDER BY shield DESC LIMIT 10";
                    attack = (await pool.query(eventtext, [user.id])).rows[0].sum;
                    break;
            }
            const text2 = "INSERT INTO EVENTSPLAYERS(userid,eventid,lastactiontime,nextactiontime,stat1,stat2) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
            thiseventuser = (await pool.query(text2, [user.id, eventresp.event.id, tnow, tnow + 1000 * 30, attack, 1])).rows[0];
            thiseventuser.username = user.username;
            thiseventuser.honorpoints = user.honorpoints;
            thiseventuser.lvl = user.lvl;
            eventresp.users.push(thiseventuser);
        }


        return eventresp;
    }
}
