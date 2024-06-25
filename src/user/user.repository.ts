import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userDto: any): Promise<User> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }

  async updateUser(tgId: number, updates: any): Promise<User> {
    return this.userModel.findOneAndUpdate({ tgId }, updates, { new: true });
  }

  async updateBalance(tgId: number, balanceToAdd) {
    return this.userModel.findOneAndUpdate(
      { tgId },
      {
        $inc: { balance: balanceToAdd },
      },
    );
  }

  async find(tgId: number): Promise<User> {
    return this.userModel.findOne({ tgId }).lean();
  }

  async getBalance(userId: string) {
    console.log('userId', userId);
    const result = await this.userModel.findOne({ tgId: userId }, { balance: 1 }).lean();
    console.log('user', result);
    return result.balance;
  }
}
