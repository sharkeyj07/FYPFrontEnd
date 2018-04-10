import { Hour } from './hour';
import { TicketStatus } from './ticketStatus';

export class Ticket {

    constructor() {
        const d = new Date();
        this.ID = d.getTime();
    }

    ID: number;
    title: string;
    priority: number;
    sprint: number;
    status: number;
    hours: Hour[] = [];
    assignedTo: string;
    description: string;
}
