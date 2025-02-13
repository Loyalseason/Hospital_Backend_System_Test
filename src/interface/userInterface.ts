import { Role } from "@prisma/client";

export interface UserInterface {
  id?: string ;
  name?: string;
  email?: string;
  password?: string;
  role?: Role
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthMiddlewareOptions {
  tokenType: "access" | "refresh" | "passwordReset";
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface authInterface {
  login(email: string, password: string): Promise<ILoginResponse>;
  verifyToken(
    tokenType: "access" | "refresh" | "passwordReset",
    token: string
  ): Promise<UserInterface>;
  signUp(name:string, email: string, password : string) : Promise<boolean>;
}

export interface BaseApi<T> {
  create(data: T): Promise<T>;
  find(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<T[]>;
}

export interface UserServicesInterface {
  getUserByEmail(id: string): Promise<UserInterface>;
}

export interface NoteData {
  id? : string;
  content: string;
  patientId?: string | null;
  doctorId?: string | null;
  createdAt?: Date;
  updatedAt? : Date
}

