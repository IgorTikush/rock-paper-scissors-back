import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Address } from '@ton/core';
import { WebAppDataGuard } from './guards/webAppDataGuard';
import { UserService } from './user/user.service';
import { IUser } from './user/interfaces/user.interface';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Post('buy-completed')
  @UseGuards(WebAppDataGuard)
  async handleBuy(
    @Body() body,
    @Req() { user }: { user: any },
    @Headers() { wallet },
  ): Promise<any> {
    console.log('buy-completed');
    console.log('user', user);
    const userInDb = await this.userService.find(user.id);
    console.log('wallet', wallet);
    // if (!userInDb) {
    //   const userToCreate = {
    //     tgId: user.id,
    //     firstName: user.first_name,
    //     lastName: user.last_name,
    //     tgUsername: user.username,
    //     balance: 0,
    //   }
    //   await this.userService.createUser(userToCreate);
    // }

    await this.appService.handleBuy(user, wallet);
    return {};
  }
}
