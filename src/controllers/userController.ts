import { Request, Response } from "express";
import ApiResponse from "../services/errorResponse";
import { SuccessResponse, BadRequestResponse } from "../services/errorResponse";
import userServices from "../services/userServices";

class UserController {
  public async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.user;
      const user = await userServices.find(id);
      return new SuccessResponse("Profile", user).send(res);
    } catch (error) {
      if (error instanceof ApiResponse) {
        return error.send(res);
      }
      return new BadRequestResponse("An unexpected error occurred while fetching user").send(res);
    }
  }
}

export default new UserController();
