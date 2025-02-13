import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client"; // Import Role enum from Prisma

export const setRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body.role = role;
    next();
  };
};
