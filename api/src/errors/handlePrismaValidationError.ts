import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../config';
import { TErrorDetails, TGenericErrorResponse } from '../interfaces/error';

const handlePrismaValidationError = (
  error: Prisma.PrismaClientValidationError,
): TGenericErrorResponse => {
  const errorMessageArr = error.message.split(`\n`);
  const errorDetailsMessage = errorMessageArr[errorMessageArr.length - 1];
  const regexPattern = /`([^`]+)`/;
  const path = errorDetailsMessage.match(regexPattern);
  const statusCode = httpStatus.BAD_REQUEST;
  const message = `${
    config.env === 'development' ? 'Prisma ' : ''
  }Validation error.`;
  const errorDetails: TErrorDetails = {
    issues: [
      {
        message: errorDetailsMessage,
        path: `${path?.[1]}`,
      },
    ],
  };
  return {
    message,
    errorDetails,
    statusCode,
  };
};

export default handlePrismaValidationError;
