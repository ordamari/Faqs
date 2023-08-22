import { registerAs } from '@nestjs/config';

export default registerAs('google', () => {
  return {
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientId: process.env.GOOGLE_CLIENT_ID,
  };
});
