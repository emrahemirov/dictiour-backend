import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { User } from 'shared/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { GlobalWord } from 'shared/entities/global-word.entity';
import { UserMeaning } from 'shared/entities/user-meaning.entity';
import { UserExample } from 'shared/entities/user-example.entity';
import { UserDictionaryModule } from './user-dictionary/user-dictionary.module';
import { UserWord } from 'shared/entities/user-word.entity';
import { GlobalWordModule } from './global-word/global-word.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dictiour',
      entities: [User, GlobalWord, UserWord, UserMeaning, UserExample],
      synchronize: true
    }),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    UserDictionaryModule,
    GlobalWordModule
  ]
})
export class AppModule {}
