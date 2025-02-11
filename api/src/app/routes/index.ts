import { Router } from 'express';

const router = Router();
type TRouteModule = {
  path: string;
  route: Router;
};
const moduleRoutes: TRouteModule[] = [];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
