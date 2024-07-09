import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { Server } from 'socket.io';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(morgan());

  await app.listen(process.env.PORT || config.get('port'));
}
bootstrap();
