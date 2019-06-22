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

        switch (eventresp.event.type) {
            case 1: //attack with all pigeons
                if (thiseventuser != null) {
                    if (thiseventuser.nextactiontime > tnow) {
                        globalhelper.setExpFalse();
                        throw new ConnectError('EVENT_REQUIREMENTS');
                    }
                    const text = "SELECT SUM(attack) FROM PIGEONS WHERE ownerid=$1";
                    let attack: number = (await pool.query(text, [user.id])).rows[0].sum;

                    thiseventuser.stat1 = +thiseventuser.stat1 + +attack;
                    thiseventuser.lastactiontime = tnow;
                    thiseventuser.nextactiontime = tnow + 1000 * 30;

                    const text2 = "UPDATE EVENTSPLAYERS SET stat1 = $1,lastactiontime=$2,nextactiontime=$3  WHERE id =$4;";
                    await pool.query(text2, [thiseventuser.stat1, thiseventuser.lastactiontime, thiseventuser.nextactiontime, thiseventuser.id]);

                    for (let i = 0; i < eventresp.users.length; i++) {
                        if (user.id == eventresp.users[i].userid) {
                            eventresp.users[i] = thiseventuser;
                        }
                    }
                } else {
                    const text = "SELECT SUM(attack) FROM PIGEONS WHERE ownerid=$1";
                    let attack: number = (await pool.query(text, [user.id])).rows[0].sum;

                    const text2 = "INSERT INTO EVENTSPLAYERS(userid,eventid,lastactiontime,nextactiontime,stat1) VALUES($1,$2,$3,$4,$5) RETURNING *";
                    thiseventuser = (await pool.query(text2, [user.id, eventresp.event.id, tnow, tnow + 1000 * 30, attack])).rows[0];
                    thiseventuser.username = user.username;
                    thiseventuser.honorpoints = user.honorpoints;
                    thiseventuser.lvl = user.lvl;
                    eventresp.users.push(thiseventuser);
                }
                break;
        }
        return eventresp;
    }
}
