import passport from 'passport';
import { configurePassport } from './passport.config';

export const initializePassport = () => {
  // Configure Passport strategies
  configurePassport();
  
  // Initialize Passport middleware
  return passport.initialize();
}; 