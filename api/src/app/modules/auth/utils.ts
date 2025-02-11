import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import AppError from '../../../errors/appError';
export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds!),
    );
    return hashedPassword;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to hash password!',
    );
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    const isPasswordMatched = await bcrypt.compare(password, hashedPassword);
    return isPasswordMatched;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to compare passwords.',
    );
  }
};
