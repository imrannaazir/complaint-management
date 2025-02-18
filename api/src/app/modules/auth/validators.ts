import { z } from 'zod';

const registerUserValidator = z.object({
  body: z.object({
    fullName: z.string(),
    email: z.string(),
    password: z.string(),
  }),
});
const resendVerificationEmailValidator = z.object({
  body: z.object({
    email: z.string(),
  }),
});
const verifyAccountValidator = z.object({
  body: z.object({
    token: z.string(),
  }),
});

const logoutValidator = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});
const refreshAccessTokenValidator = z.object({
  cookies: z.object({
    refreshToken: z.string(),
  }),
});

const AuthValidators = {
  registerUserValidator,
  resendVerificationEmailValidator,
  verifyAccountValidator,
  logoutValidator,
  refreshAccessTokenValidator,
};

export default AuthValidators;
