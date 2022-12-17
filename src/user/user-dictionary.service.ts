import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  User,
  GlobalWord,
  UserExample,
  UserMeaning,
  UserWord
} from 'shared/entities';
import { AddUserExampleDto, AddUserWordDto, AddUserMeaningDto } from './dtos';

@Injectable()
export class UserDictionaryService {
  constructor(
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
    @InjectRepository(UserWord)
    private userMeaningRepository: Repository<UserMeaning>,
    @InjectRepository(UserWord)
    private userExampleRepository: Repository<UserExample>,
    @InjectRepository(GlobalWord) private wordRepository: Repository<GlobalWord>
  ) {}

  async deleteWord(id: string, currentUser: User) {
    try {
      const { affected } = await this.userWordRepository.delete({
        id: id,
        user: currentUser
      });

      if (affected === 0) throw new NotFoundException();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteMeaning(id: string, currentUser: User) {
    try {
      const { affected } = await this.userMeaningRepository.delete({
        id: id,
        user: currentUser
      });

      if (affected === 0) throw new NotFoundException();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteExample(id: string, currentUser: User) {
    try {
      const { affected } = await this.userExampleRepository.delete({
        id: id,
        user: currentUser
      });

      if (affected === 0) throw new NotFoundException();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
