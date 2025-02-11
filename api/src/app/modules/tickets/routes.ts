import { Role } from '@prisma/client';
import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import TicketControllers from './controllers';
import TicketValidators from './validators';

const routes = Router();

routes.post(
  '/create',
  auth(Role.CUSTOMER),
  validateRequest(TicketValidators.createTicketValidator),
  TicketControllers.createTicket,
);

routes.patch(
  '/update/:ticketId',
  auth(Role.CUSTOMER),
  validateRequest(TicketValidators.createTicketValidator),
  TicketControllers.updateTicket,
);

routes.delete(
  '/delete/:ticketId',
  auth(Role.CUSTOMER),
  TicketControllers.deleteTicket,
);

routes.get('/get-single/:ticketId', auth(), TicketControllers.getSingleTicket);

const TicketRoutes = routes;
export default TicketRoutes;
