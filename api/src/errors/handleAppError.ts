import { TGenericErrorResponse } from '../interfaces/error';
import AppError from './appError';

const handleAppError = (error: AppError): TGenericErrorResponse => {
  return {
    statusCode: error.statusCode,
    message: 'App Error.',
    errorDetails: error.message,
  };
};
export default handleAppError;
