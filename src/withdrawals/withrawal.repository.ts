import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Withdrawal, WithdrawalDocument } from "./withrawal.schema";
import { Model } from "mongoose";


@Injectable()
export class WithdrawalRepository {
  constructor(@InjectModel(Withdrawal.name) private withdrawalModel: Model<WithdrawalDocument>) {}

  async create({ user, amount, wallet, commission }) {
    this.withdrawalModel.create({ user: user.tgId, amount, wallet })
  }
}