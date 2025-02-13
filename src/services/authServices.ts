import { authInterface, ILoginResponse, UserInterface } from "../interface/userInterface";

import {
  BadRequestResponse,
  NotAuthorizedResponse,
  NotFoundResponse,
  SuccessResponse,
} from "../services/errorResponse";

import bcrypt from "bcryptjs";
import {
  generateRefreshToken,
  generateToken,
} from "../utils/tokenUtils";

import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_TOKEN, JWT_RESET_PASSWORD } from "../utils/tokenUtils";
import userServices from "./userServices";
import { Role } from "@prisma/client";

class AuthService implements authInterface  {
  public async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await userServices.findByEmail(email)

    if (!user) {
      throw new NotFoundResponse("User Not Found");
    }

    const auth = await bcrypt.compare(password, user.password as string);

    if (!auth) {
      throw new NotAuthorizedResponse("Invalid Credentials");
    }

    const accessToken = generateToken(user.id!).toString();
    const refreshToken = generateRefreshToken(user.id!).toString();

    return { accessToken, refreshToken };
  }

  
  public async verifyToken(
    tokenType: "access" | "refresh" | "passwordReset",
    token: string
  ): Promise<UserInterface> {
    let secretKey: string | undefined;

    switch (tokenType) {
      case "access":
        secretKey = JWT_SECRET;
        break;
      case "refresh":
        secretKey = JWT_REFRESH_TOKEN;
        break;

      case "passwordReset":
        secretKey = JWT_RESET_PASSWORD;
        break;

      default:
        throw new NotAuthorizedResponse("Unauthorized ! Invalid Token Provided");
    }

    if (!secretKey) {
      throw new NotAuthorizedResponse("Unauthorized ! Invalid Token");
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const user = await userServices.find(decoded.id);

    const userPayload: UserInterface = {
      id: user?.id as string,
      name: user?.name as string,
      email: user?.email as string,
      role : user?.role 
    };

    return userPayload;
  }

  public async signUp(name: string, email: string, password: string, role: Role = Role.PATIENT): Promise<boolean> {
   
    if(!name || !email || !password){
      throw new BadRequestResponse("Invalid Data")
    }
    
    const foundUser = await userServices.searchEmail({email});

    if(foundUser){
      throw new BadRequestResponse("Email Already Exis, Try again with a unique email")
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    password = encryptedPassword
    const user = await userServices.create({name, email, password, role})
    if(!user){
      throw new BadRequestResponse("Couldn't Create")
     }

    return true
  }

}
export default new AuthService();
