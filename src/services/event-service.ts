import { User } from '../entities/User';
import db from '../db/pgpool';
import { Event } from '../entities/event';
import { Message } from '../entities/message';
import { ConnectError } from '../classes/connect-error';
import { Eventuser } from '../entities/eventuser';
import { EventResponse } from '../entities/eventsresponse';

let pool = db.getPool();

export class EventService {
    static async getEventInfo(user: User): Promise<EventResponse> {
        let text = "SELECT * FROM EVENTS ORDER BY id DESC LIMIT 1";
        let event: Event = (await pool.query(text)).rows[0];

        text = "SELECT eventsplayers.*,users.username FROM EVENTS LEFT JOIN USERS ON users.id=events.userid WHERE eventsplayers.idevent=$1;"
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
                    //update infos
                }
                break;
            case 2:
                break;
        }
        const eventresp: EventResponse = { "event": event, "users": eventusers };

        return eventresp;
    }

    static async doEventAction(user: User): Promise<EventResponse> {
        let eventresp: EventResponse = await this.getEventInfo(user);

        if (eventresp.event.period != 1) {
            //error cant play
        }

        switch (eventresp.event.type) {
            case 1:
                
                break;
        }

        return eventresp;
    }
}
