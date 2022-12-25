import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalWordModule } from 'global-word/global-word.module';
import { UserWord, UserExample, UserMeaning } from 'shared/entities';
import {
  UserExampleController,
  UserMeaningController,
  UserWordController
} from './controllers';
import {
  UserExampleService,
  UserMeaningService,
  UserWordService
} from './services';

@Module({
  imports: [
    AuthModule,
    GlobalWordModule,
    TypeOrmModule.forFeature([UserWord, UserMeaning, UserExample])
  ],
  controllers: [
    UserWordController,
    UserMeaningController,
    UserExampleController
  ],
  providers: [UserWordService, UserMeaningService, UserExampleService]
})
export class UserDictionaryModule {}
