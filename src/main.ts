import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, '..', 'public')); //js css image
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // stored html
  app.setViewEngine('ejs'); //set view engine
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
