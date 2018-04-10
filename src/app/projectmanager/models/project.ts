import { Ticket } from './ticket';
import { Priority } from './priority';
import { TicketStatus } from './ticketStatus';
import { Sprint } from './sprint';

export class Project {
    _id: string;
    title: string;
    admins: string[] = [];
    users: string[] = [];
    tickets: Ticket[] = [];
    priorities: Priority[] = [];
    ticketStatuses: TicketStatus[] = [];
    sprints: Sprint[] = [];
}
