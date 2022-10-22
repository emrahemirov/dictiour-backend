import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { TypeOrmExModule } from '@database/typeorm-ex.module';
import { UserRepository } from '@user/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dictiour',
      autoLoadEntities: true,
      synchronize: true
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    AuthModule
  ]
})
export class AppModule {}
