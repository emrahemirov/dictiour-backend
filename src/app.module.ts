import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { GlobalWord } from 'entities/global-word.entity';
import { UserMeaning } from 'entities/user-meaning.entity';
import { UserExample } from 'entities/user-example.entity';
import { UserWord } from 'entities/user-word.entity';
import {
  AuthModule,
  GlobalWordModule,
  ReportModule,
  UserDictionaryModule
} from 'modules';
import { Report } from 'entities';

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
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    UserDictionaryModule,
    GlobalWordModule,
    ReportModule
  ]
})
export class AppModule {}
