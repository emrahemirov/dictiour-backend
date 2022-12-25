import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserMeaning } from 'shared/entities';
import { AddUserMeaningDto } from '../../shared/dtos';
import { GlobalWordService } from 'global-word/global-word.service';
import { UserWordService } from './user-word.service';

@Injectable()
export class UserMeaningService {
  constructor(
    @InjectRepository(UserMeaning)
    private userMeaningRepository: Repository<UserMeaning>,

    private userWordService: UserWordService,
    private globalWordService: GlobalWordService
  ) {}

  async getOrCreateUserMeaning(
    { fromWord, toWord }: AddUserMeaningDto,
    currentUser: User
  ) {
    if (fromWord.text === toWord.text && fromWord.language === toWord.language)
      throw new BadRequestException('meaning_words_are_same');

    const userWord = await this.userWordService.getOrCreateUserWord(
      { word: fromWord },
      currentUser
    );
    const globalToWord = await this.globalWordService.getOrCreate(
      toWord,
      'asUserMeaning'
    );

    const foundUserMeaning = await this.userMeaningRepository.findOne({
      where: {
        user: { id: currentUser.id },
        fromWord: { id: userWord.id },
        toWord: { id: globalToWord.id }
      }
    });
    if (foundUserMeaning) return foundUserMeaning;

    const createdUserMeaning = await this.userMeaningRepository
      .create({
        fromWord: userWord,
        toWord: globalToWord,
        user: currentUser
      })
      .save();

    return createdUserMeaning;
  }

  async deleteUserMeaning(id: string, currentUser: User) {
    const foundUserMeaning = await this.userMeaningRepository.findOne({
      where: { id, user: { id: currentUser.id } }
    });

    if (!foundUserMeaning) throw new NotFoundException();

    this.globalWordService.decreaseStatistics(
      foundUserMeaning.toWord.id,
      'asUserMeaning'
    );
  }
}
