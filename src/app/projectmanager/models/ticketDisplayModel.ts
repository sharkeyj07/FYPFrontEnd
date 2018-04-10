import { Hour } from './hour';
import { Priority } from './priority';
import { Sprint } from './sprint';
import { TicketStatus } from './ticketStatus';

export class TicketDisplayModel {
    ID: number;
    title: string;
    priority: Priority;
    sprint: Sprint;
    hours: Hour[] = [];
    assignedTo: string;
    description: string;
    status: TicketStatus;
}
