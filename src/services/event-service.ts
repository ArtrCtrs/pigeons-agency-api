import { User } from '../entities/User';
import db from '../db/pgpool';
import { Event } from '../entities/event';
import { Message } from '../entities/message';
import { ConnectError } from '../classes/connect-error';
import { Eventuser } from '../entities/eventuser';

let pool = db.getPool();

export class EventService {
    static async getEventInfo(user: User): Promise<string> {
        let text = "SELECT * FROM EVENTS ORDER BY id DESC LIMIT 1";
        let event: Event = (await pool.query(text)).rows[0];

        text="SELECT events.*,users.username FROM EVENTS LEFT JOIN USERS ON users.id=events.userid;"
        let eventusers:Eventuser[] = (await pool.query(text)).rows;
        switch (event.period) {
            case 0:
                if (event.starttime < Date.now()) {
                    event.period = 1;

                }
                break;
            case 1:
                break;
        }


        return "data";
    }
}