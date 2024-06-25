import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Headers,
  Options,
  Res,
} from '@nestjs/common';
import { WebAppDataGuard } from '../guards/webAppDataGuard';
import { UserService } from './user.service';
import { IUser } from './interfaces/user.interface';
import { Response, Request } from 'express';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('user-info')
  @UseGuards(WebAppDataGuard)
  async getUserInfo(@Req() { user }: { user: any }) {
    console.log(user)
    const userInDb = await this.userService.find(user.id);
    console.log(userInDb)
    return userInDb;
  }
}