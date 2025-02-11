import { z } from 'zod';

const createTicketValidator = z.object({
  body: z.object({
    subject: z.string(),
    description: z.string(),
  }),
});

const TicketValidators = { createTicketValidator };
export default TicketValidators;
