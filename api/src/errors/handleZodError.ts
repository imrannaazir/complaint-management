import httpStatus from 'http-status';
import { ZodError } from 'zod';
import config from '../config';
import { TErrorSource, TGenericErrorResponse } from '../interfaces/error';

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const issues: TErrorSource[] = error.issues.map(issue => {
    const path = issue.path[issue.path.length - 1];
    return {
      message: `${path} is ${issue.message}.`,
      path: `${path}`,
    };
  });

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: `${config.env === 'development' ? 'Zod ' : ''}Validation Error`,
    errorDetails: { issues },
  };
};
export default handleZodError;
