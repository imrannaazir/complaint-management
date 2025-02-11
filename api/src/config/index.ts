import dotenv from 'dotenv';
import path from 'path';

const envPath =
  process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), '.env.prod')
    : path.join(process.cwd(), '.env');

dotenv.config({ path: envPath });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.SALT_ROUND,
  client_origin: process.env.CLIENT_ORIGIN,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
    verify_secret: process.env.JWT_VERIFY_SECRET,
    verify_expire_in: process.env.JWT_VERIFY_EXPIRE_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
  },
  node_mailer: {
    email_app_password: process.env.EMAIL_APP_PASSWORD,
    my_email_address: process.env.MY_EMAIL_ADDRESS,
  },
  credential: {
    admin: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.PASSWORD,
    },
    user: {
      email: process.env.USER_EMAIL,
      password: process.env.PASSWORD,
    },
  },
};
