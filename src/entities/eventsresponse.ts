import { Event } from '../entities/event';
import { Eventuser } from '../entities/eventuser';
export interface EventResponse {
    event: Event;
    users: Eventuser[];
}