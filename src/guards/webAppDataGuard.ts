import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as config from 'config';
import { createHmac } from 'node:crypto';

@Injectable()
export class WebAppDataGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    console.log('received', request.headers);
    const qs = request.headers['tg-data']; // Assuming the data is in a query parameter named 'qs'
    if (!qs) {
      throw new UnauthorizedException('No data provided');
    }

    const token = config.get<string>('tg-bot-token');
    const sk = this.hmac(token, 'WebAppData');
    const parts = qs.split('&').map((p) => p.split('='));
    const hashpart = parts.splice(
      parts.findIndex((p) => p[0] === 'hash'),
      1,
    )[0];
    const dcs = parts
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map((p) => decodeURIComponent(p.join('=')))
      .join('\n');
    if (this.hmac(dcs, sk).toString('hex') !== hashpart[1]) {
      throw new UnauthorizedException('Invalid data signature');
    }

    // If you want to attach the verified data to the request object
    request.verifiedData = parts.reduce((acc, part) => {
      acc[part[0]] = decodeURIComponent(part[1]);
      return acc;
    }, {});
    request.user = JSON.parse(request.verifiedData.user);
    // console.log(request.user);
    // request.user = {
    //   id: 426843041,
    //   tgId: 426843041,
    //   firstName: 'Igor',
    //   lastName: '',
    //   tgUsername: 'peculiar37',
    //   // language_code: 'en',
    //   balance: 2,
    // };
    console.log(request.user);
    return true; // Validation passed, proceed with the request
  }

  private hmac(data: string, key: string | Buffer): Buffer {
    return createHmac('sha256', key).update(data).digest();
  }
}
