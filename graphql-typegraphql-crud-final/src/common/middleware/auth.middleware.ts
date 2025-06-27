import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { JWTService } from '../services/jwt.service';
import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-express";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const authenticateLocal = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: info?.message || 'Authentication failed' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const payload = JWTService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const typeGraphqlAuth: MiddlewareFn = async ({ context }, next) => {
  const req = (context as any).req || (context as any).request;
  const authHeader = req?.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("No token provided");
  }
  const token = authHeader.substring(7);
  try {
    const payload = JWTService.verifyToken(token);
    (context as any).user = payload;
    return next();
  } catch (error) {
    throw new AuthenticationError("Invalid token");
  }
}; 