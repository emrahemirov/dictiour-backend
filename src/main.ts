import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as osu from 'node-os-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // const { cpu, mem } = osu;
  // let i = 1;
  // setInterval(async () => {
  //   const { usedMemMb, totalMemMb } = await mem.used();

  //   console.log(
  //     `second ${i}  CPU USAGE: ${await cpu.usage()}% / MEM USAGE: ${(
  //       usedMemMb / totalMemMb
  //     ).toFixed(2)}%`
  //   );

  //   i++;
  // }, 1000);

  await app.listen(3001);
}

bootstrap();
