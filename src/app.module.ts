import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { User } from 'shared/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { Word } from 'shared/entities/word.entity';
import { UserMeaning } from 'shared/entities/user-meaning.entity';
import { UserExample } from 'shared/entities/user-example.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'dictiour',
      entities: [User, Word, UserMeaning, UserExample],
      synchronize: true
    }),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    UserModule,
    DictionaryModule
  ]
})
export class AppModule {}
