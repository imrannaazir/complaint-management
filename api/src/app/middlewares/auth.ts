import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/appError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../shared/prisma';

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      const verifiedUser = await jwtHelpers.verifyToken(
        token,
        config.jwt__access_secret as string,
      );

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: verifiedUser.id,
        },
      });

      req.user = user;
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
