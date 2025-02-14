import { PrismaClient } from '@prisma/client';
import { BaseService } from './baseService';
import { User } from '@prisma/client';
import { NotFoundResponse } from './errorResponse';
import { UserInterface } from '../interface/userInterface';

const prisma = new PrismaClient();

class UserService extends BaseService<UserInterface> {
  constructor() {
    super("user");
  }

  async findByEmail(email: string): Promise<UserInterface> {
    const user = await prisma.user.findUnique({
      where: { email },

    });
    if (!user) {
      throw new NotFoundResponse("Resource Not Found");
    }

    const userPayload : UserInterface = {
        id : user.id,
        password : user.password
    }
    return userPayload;
  }

  async searchEmail(identifier: { id?: string; email?: string }): Promise<boolean> {
    const user = identifier.id
      ? await this.find(identifier.id)
      : identifier.email
        ? await prisma.user.findUnique({ where: { email: identifier.email } })
        : null;

    if (!user) {
      return false;
    }
    return true
  }

  async create(data: Partial<UserInterface>): Promise<UserInterface> {
    if (!data.email || !data.password || !data.name) {
      throw new Error('Missing required fields: name, email, or password');
    }
  
    // Create user with proper type
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role ?? 'PATIENT',
      },
      include : {
        doctor : true,
        patient : true
      }
    });
  
    if (user.role === 'PATIENT') {
      await this.prisma.patient.create({
        data: { userId: user.id },
      });
    } else if (user.role === 'DOCTOR') {
      await this.prisma.doctor.create({
        data: { userId: user.id },
      });
    }
    return user;
  }
  
  


  // private formatUserPayload(user: User): UserInterface {
  //   return {
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //     role : user.role,
  //     createdAt :user.createdAt
  //   };
  // }
}

export default new UserService();
