import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // class transformer를 통해 데이터의 유효성 체크 가능
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
