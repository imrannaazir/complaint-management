import { Status, User } from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../../config';
import AppError from '../../../errors/appError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import sendEmail, {
  getValidateMailContent,
  TEmailPayload,
} from '../../../shared/send-mail';
import {
  TJwtPayload,
  TLoginPayload,
  TLoginReturn,
  TRegisterPayload,
} from './types';
import { comparePassword, hashPassword } from './utils';

const registerUser = async (
  payload: TRegisterPayload,
): Promise<Omit<User, 'password'>> => {
  const { password, ...restPayload } = payload;
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      password: hashedPassword,
      ...restPayload,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      status: true,
      updatedAt: true,
    },
  });

  const jwtPayload: TJwtPayload = {
    id: user?.id,
    fullName: user?.fullName,
    email: user?.email,
    role: user?.role,
  };

  const verifyToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.verify_secret!,
    config?.jwt.verify_expire_in!,
  );

  const redirectUrl = `${config.client_origin}/verification?token=${verifyToken}`;
  const emailPayload: TEmailPayload = {
    receiver: user?.email,
    subject: 'Activate your account.',
    html: getValidateMailContent({ redirectUrl }),
  };
  sendEmail(emailPayload);
  return user;
};

const resendVerificationEmail = async (email: string): Promise<null> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'You are not registered, please sign up.',
    );
  }

  if (isUserExist.status === Status.BLOCKED) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You has been blocked.');
  }

  const jwtPayload: TJwtPayload = {
    fullName: isUserExist?.fullName,
    id: isUserExist?.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const verificationToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.verify_secret!,
    config.jwt.verify_expire_in!,
  );

  const redirectUrl = `${config.client_origin}/verification?token=${verificationToken}`;

  const emailPayload: TEmailPayload = {
    html: getValidateMailContent({ redirectUrl }),
    receiver: isUserExist?.email,
    subject: 'Verify your account.',
  };

  sendEmail(emailPayload);
  return null;
};

const verifyAccount = async (token: string): Promise<null> => {
  const isTokenValid = (await jwtHelpers.verifyToken(
    token,
    config.jwt.verify_secret!,
  )) as TJwtPayload;
  if (!isTokenValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Token is invalid.');
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      id: isTokenValid?.id,
    },
  });

  if (isUserExist.status === Status.BLOCKED) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Your account has been blocked.',
    );
  }

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      status: Status.ACTIVE,
    },
  });

  return null;
};

const loginUser = async (payload: TLoginPayload): Promise<TLoginReturn> => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
    select: {
      password: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      id: true,
    },
  });

  const isPasswordMatched = await comparePassword(
    payload.password,
    isUserExist?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Invalid one or more credentials.',
    );
  }

  if (
    isUserExist?.status === Status.PENDING ||
    isUserExist?.status === Status.BLOCKED
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `Your account is ${String(isUserExist?.status).toLowerCase()}.`,
    );
  }

  const jwtPayload: TJwtPayload = {
    email: isUserExist?.email,
    fullName: isUserExist?.fullName,
    id: isUserExist?.id,
    role: isUserExist?.role,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.access_secret!,
    config.jwt.access_expire_in!,
  );
  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config?.jwt.refresh_secret!,
    config?.jwt.refresh_expire_in!,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (token: string): Promise<TLoginReturn> => {
  const isTokenValid = await jwtHelpers.verifyToken(
    token,
    config.jwt.refresh_secret!,
  );
  if (!isTokenValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access.');
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: isTokenValid?.id,
    },
  });

  if (user?.status !== Status.ACTIVE) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `Your account is ${String(user.status).toLowerCase()}.`,
    );
  }

  const jwtPayload: TJwtPayload = {
    fullName: user?.fullName,
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.access_secret!,
    config.jwt.access_expire_in!,
  );
  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.refresh_secret!,
    config.jwt.refresh_expire_in!,
  );

  return { accessToken, refreshToken };
};

const AuthServices = {
  registerUser,
  resendVerificationEmail,
  verifyAccount,
  loginUser,
  refreshAccessToken,
};

export default AuthServices;
