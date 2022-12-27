import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  AuthModule,
  GlobalWordModule,
  ReportModule,
  UserDictionaryModule,
  UserModule
} from 'modules';
import {
  User,
  Report,
  GlobalWord,
  UserMeaning,
  UserExample,
  UserWord
} from 'entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dictiour',
      entities: [User, GlobalWord, UserWord, UserMeaning, UserExample, Report],
      synchronize: true
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    UserDictionaryModule,
    AuthModule,
    ReportModule,
    UserModule,

    GlobalWordModule
  ]
})
export class AppModule {}
