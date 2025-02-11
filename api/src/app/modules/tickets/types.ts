import { Ticket } from '@prisma/client';

export type TCreateTicket = Pick<Ticket, 'subject' | 'description'>;
