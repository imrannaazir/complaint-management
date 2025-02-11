/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import AppError from '../../errors/appError';
import handleAppError from '../../errors/handleAppError';
import handleGeneralError from '../../errors/handleGeneralError';
import handleKnownRequestError from '../../errors/handleKnownRequestError';
import handlePrismaValidationError from '../../errors/handlePrismaValidationError';
import handleZodError from '../../errors/handleZodError';
import { TErrorDetails } from '../../interfaces/error';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let message = 'Something went wrong!';
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let errorDetails: TErrorDetails = 'Something went wrong.';

  // handle zod error
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorDetails = simplifiedError.errorDetails;
  }
  // handle prisma validation error
  else if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaValidationError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorDetails = simplifiedError.errorDetails;
  }

  // handle client known error
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleKnownRequestError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorDetails = simplifiedError.errorDetails;
  }

  //handle App Error
  else if (error instanceof AppError) {
    const simplifiedError = handleAppError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorDetails = simplifiedError.errorDetails;
  }

  // handle general error
  else if (error instanceof Error) {
    const simplifiedError = handleGeneralError(error);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorDetails = simplifiedError.errorDetails;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
