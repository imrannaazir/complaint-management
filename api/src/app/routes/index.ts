import { Router } from 'express';
import AuthRoutes from '../modules/auth/routes';
import TicketRoutes from '../modules/tickets/routes';

const router = Router();
type TRouteModule = {
  path: string;
  route: Router;
};
const moduleRoutes: TRouteModule[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/tickets',
    route: TicketRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
