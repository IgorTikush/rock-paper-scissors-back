import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userDto: any): Promise<IUser> {
    return this.userRepository.createUser(userDto);
  }

  async updateUser(tgId: number, updates: any): Promise<IUser> {
    return this.userRepository.updateUser(tgId, updates);
  }

  async updateBalance(tgId: number, balance: number): Promise<IUser> {
    return this.userRepository.updateUser(tgId, { $inc: { balance } });
  }

  async find(tgId: number): Promise<IUser> {
    return this.userRepository.find(tgId);
  }

  async getBalance(userId: string): Promise<number> {
    return this.userRepository.getBalance(userId);
  }
}
