import { NextFunction, Request, Response } from "express";
import ApiResponse, { BadRequestResponse, NotAuthorizedResponse } from "../services/errorResponse";
import authServices from "../services/authServices";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AuthMiddlewareOptions } from "../interface/userInterface";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authMiddleware(options: AuthMiddlewareOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new NotAuthorizedResponse("Unauthorized");
      }

      
      const token = authHeader.split(" ")[1] as string;
      
      const user = await authServices.verifyToken(options.tokenType, token);
      req.user = user;

      next();
    } catch (error) {
      if (error instanceof ApiResponse) {
        return error.send(res);
      }

      if (error instanceof JsonWebTokenError) {
        return new NotAuthorizedResponse("Unauthorized or Invalid token signature").send(res);
      } else if (error instanceof TokenExpiredError) {
        return new NotAuthorizedResponse("Token Expired").send(res);
      }

      return new BadRequestResponse("An unexpected error occurred").send(res);
    }
  };
}
