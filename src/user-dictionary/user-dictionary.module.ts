import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from 'shared/entities/user-word.entity';
import { UserDictionaryController } from './user-dictionary.controller';
import { UserDictionaryService } from './user-dictionary.service';
import { GlobalWordModule } from 'global-word/global-word.module';
import { UserExample, UserMeaning } from 'shared/entities';

@Module({
  imports: [
    AuthModule,
    GlobalWordModule,
    TypeOrmModule.forFeature([UserWord, UserMeaning, UserExample])
  ],
  controllers: [UserDictionaryController],
  providers: [UserDictionaryService]
})
export class UserDictionaryModule {}
