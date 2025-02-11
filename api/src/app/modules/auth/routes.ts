import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import AuthControllers from './controllers';
import AuthValidators from './validators';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidators.registerUserValidator),
  AuthControllers.registerUser,
);

router.post(
  '/resend-verification-mail',
  validateRequest(AuthValidators.resendVerificationEmailValidator),
  AuthControllers.resendVerificationEmail,
);

router.post(
  '/verify-account',
  validateRequest(AuthValidators.verifyAccountValidator),
  AuthControllers.verifyAccount,
);

const AuthRoutes = router;
export default AuthRoutes;
