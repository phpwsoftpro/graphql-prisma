export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    accessTokenExpiry: '1h',
    refreshTokenExpiry: '7d',
    issuer: 'graphql-prisma-app',
    audience: 'graphql-prisma-users'
  },
  bcrypt: {
    saltRounds: 10
  }
}; 