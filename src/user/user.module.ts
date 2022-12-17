import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from 'shared/entities/user-word.entity';
import { GlobalWord } from 'shared/entities/global-word.entity';
import { UserDictionaryController } from './user-dictionary.controller';
import { UserDictionaryService } from './user-dictionary.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserWord, GlobalWord])],
  controllers: [UserDictionaryController],
  providers: [UserDictionaryService]
})
export class UserDictionaryModule {}
