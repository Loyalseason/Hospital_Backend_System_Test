import jwt from "jsonwebtoken";
import { BadRequestResponse } from "../services/errorResponse";
import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
export const JWT_REFRESH_TOKEN: string | undefined = process.env.JWT_REFRESH_TOKEN;
export const JWT_RESET_PASSWORD: string | undefined = process.env.JWT_RESET_PASSWORD;

export function generateToken(id: string) {
  try {
    if (!JWT_SECRET || !id) {
      console.log("Check Your JWT_TOKEN OR ID");
      throw new BadRequestResponse("An Error Ocurred While Generating Token");
    }

    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "12h" });
  } catch (error) {
    console.log(error);
    if (error) {
      throw new BadRequestResponse("An Error Ocurred While Generating Token");
    }
    return { error: "An Error Ocurred While Generating Token" };
  }
}

export function generateRefreshToken(id: string) {
  try {
    if (!JWT_REFRESH_TOKEN || !id) {
      console.log("Check Your JWT_REFRESH_TOKEN OR ID");
      throw new BadRequestResponse("An Error Ocurred While Generating Refresh Token");
    }

    return jwt.sign({ id }, JWT_REFRESH_TOKEN, { expiresIn: "5d" });
  } catch (error) {
    console.log(error);
    if (error) {
      throw new BadRequestResponse("An Error Ocurred While Generating Refresh Token");
    }
    return { error: "An Error Ocurred While Generating Refresh Token" };
  }
}

export function generateResetPasswordToken(id: string) {
  try {
    if (!JWT_RESET_PASSWORD || !id) {
      console.log("Check Your JWT_PASSWORD_RESET OR ID");
      throw new BadRequestResponse("An Error Ocurred While Generating Password Reset Token");
    }

    return jwt.sign({ id }, JWT_RESET_PASSWORD, { expiresIn: "5d" });
  } catch (error) {
    console.log(error);
    if (error) {
      throw new BadRequestResponse("An Error Ocurred While Generating Password Reset Token");
    }
    return { error: "An Error Ocurred While Generating Password Reset Token" };
  }
}
