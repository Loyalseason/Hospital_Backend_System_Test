import { PrismaClient } from '@prisma/client';
import { BaseApi } from '../interface/userInterface';
import { NotAuthorizedResponse } from './errorResponse';



export abstract class BaseService<T> implements BaseApi<T> {
  protected prisma: PrismaClient;
  protected model: keyof PrismaClient;

  constructor(model: keyof PrismaClient) {
    this.prisma = new PrismaClient();
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await (this.prisma[this.model] as any).create({ data });
  }
  
  async find(id: string): Promise<T | null> {
    return await (this.prisma[this.model] as any).findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await (this.prisma[this.model] as any).update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    const result = await (this.prisma[this.model] as any).delete({ where: { id } });
    return !!result;
  }

  async findAll(): Promise<T[]> {
    return await (this.prisma[this.model] as any).findMany();
  }
}

// Auth-aware base service that extends BaseService
export abstract class AuthorizedBaseService<T> extends BaseService<T> {
  protected abstract checkAuthorization(id: string, userId: string, userRole: string): Promise<boolean>;

  async authorizedUpdate(id: string, data: Partial<T>, userId: string, userRole: string): Promise<T | null> {
      const isAuthorized = await this.checkAuthorization(id, userId, userRole);
      if (!isAuthorized) {
          throw new NotAuthorizedResponse("Not authorized to perform this action");
      }
      return super.update(id, data);
  }

  // Override the base update method to throw an error
  async update(id: string, data: Partial<T>): Promise<T | null> {
      throw new Error("Use authorizedUpdate instead of update for this service");
  }
}