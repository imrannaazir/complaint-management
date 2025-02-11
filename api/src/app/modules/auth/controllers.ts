import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import AuthServices from './services';

const registerUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.registerUser(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Account created, please verify email.',
    data: result,
  });
});

const resendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthServices.resendVerificationEmail(email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Resent your account verification email.',
    data: null,
  });
});
const verifyAccount = catchAsync(async (req, res) => {
  const { token } = req.body;
  await AuthServices.verifyAccount(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your are verified, please login.',
    data: null,
  });
});

const AuthControllers = {
  registerUser,
  resendVerificationEmail,
  verifyAccount,
};
export default AuthControllers;
