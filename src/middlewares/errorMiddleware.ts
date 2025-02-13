import { Request, Response, NextFunction } from "express";
import ApiResponse from "../services/errorResponse";
function globalErrorHandler(err: ApiResponse, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "An Internal Server Error Occurred";

  res.status(err.statusCode).json({ status: err.message });
}

export default globalErrorHandler;
