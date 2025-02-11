import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/appError';
const generateToken = (payload: any, secret: string, expiresIn: string) => {
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
  return token;
};
const verifyToken = async (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid access token.');
  }
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
