import { Response } from "express";

export enum statusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERR = 500,
}

abstract class ApiResponse extends Error {
  constructor(
    public statusCode: statusCode,
    public message: string,
    public data?: any
  ) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  protected prepare(res: Response): Response {
    return res.status(this.statusCode).json({
      message: this.message,
      data: this.data,
    });
  }

  public send(res: Response): Response {
    return this.prepare(res);
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(message: string, data?: any) {
    super(statusCode.SUCCESS, message, data);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message: string) {
    super(statusCode.BAD_REQUEST, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(message: string) {
    super(statusCode.NOT_FOUND, message);
  }
}

export class NotAuthorizedResponse extends ApiResponse {
  constructor(message: string) {
    super(statusCode.UNAUTHORIZED, message);
  }
}

export default ApiResponse;
