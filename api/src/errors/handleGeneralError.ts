import httpStatus from 'http-status';
import { TGenericErrorResponse } from '../interfaces/error';

const handleGeneralError = (error: Error): TGenericErrorResponse => {
  return {
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    message: 'General Error',
    errorDetails: error.message,
  };
};

export default handleGeneralError;
