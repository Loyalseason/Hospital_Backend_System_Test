import { Request, Response, NextFunction } from "express";
import authServices from "../services/authServices";
import { authInterface, ILoginResponse, UserInterface } from "../interface/userInterface";
import ApiResponse, { NotFoundResponse } from "../services/errorResponse";
import { SuccessResponse, BadRequestResponse } from "../services/errorResponse";
import { Role } from "@prisma/client";

class AuthController {
  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result: ILoginResponse = await authServices.login(email, password);

      res.cookie("accessToken", result.accessToken, { httpOnly: true });
      res.cookie("refreshToken", result.refreshToken, { httpOnly: true });

      return new SuccessResponse("successful", result).send(res);
    } catch (error) {
      console.log(error)
      if (error instanceof ApiResponse) {
        return error.send(res);
      }
      return new BadRequestResponse("An unexpected error occurred While Fetching User").send(res);
    }
  }

  public async signUp(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      
      if (!name || !email || !password) {
        throw new BadRequestResponse("All fields are required");
      }
      
      if (!Object.values(Role).includes(role)) {
        throw new BadRequestResponse("Invalid role provided");
      }

      const result = await authServices.signUp(name, email, password, role);

      return new SuccessResponse("successful", result).send(res);
    } catch (error) {
      console.log(error)
      if (error instanceof ApiResponse) {
        return error.send(res);
      }

      return new BadRequestResponse("An unexpected error occurred While Fetching User").send(res);
    }
  }

 

}

export default new AuthController();
