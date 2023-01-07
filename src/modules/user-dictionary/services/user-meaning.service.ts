import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserMeaning, UserWord } from 'entities';
import {
  AddUserMeaningDto,
  DictionarySearchParams
} from '../../../shared/dtos';
import { GlobalWordService } from 'modules/global-word/global-word.service';
import { UserWordService } from './user-word.service';

@Injectable()
export class UserMeaningService {
  constructor(
    @InjectRepository(UserMeaning)
    private userMeaningRepository: Repository<UserMeaning>,

    private userWordService: UserWordService,
    private globalWordService: GlobalWordService
  ) {}

  async getAllUserMeanings(
    { page, userWordId, language, search }: DictionarySearchParams,
    currentUser: User
  ) {
    const query = this.userMeaningRepository
      .createQueryBuilder('user_meaning')
      .leftJoin('user_meaning.toWord', 'global_word')
      .addSelect(['global_word'])
      .where('user_meaning.user_id = :id', {
        id: currentUser.id
      })
      .andWhere('user_meaning.from_word_id = :fromWordId', {
        fromWordId: userWordId
      });

    if (language)
      query.andWhere('global_word.language = :language', {
        language
      });

    if (search)
      query.andWhere(`(LOWER(global_word.text) LIKE LOWER(:search))`, {
        search: `%${search}%`
      });

    const userMeanings = await query
      .skip((page - 1) * 30)
      .take(30)
      .getMany();

    return userMeanings;
  }

  async getUserMeaningWithId(id: string) {
    const foundUserMeaning = await this.userMeaningRepository.findOne({
      where: { id }
    });

    return foundUserMeaning;
  }

  async createUserMeaning(
    { fromWordId, toWord }: AddUserMeaningDto,
    currentUser: User
  ) {
    const userWord: UserWord = await this.userWordService.getUserWordWithId(
      fromWordId
    );

    if (
      userWord.word.text === toWord.text &&
      userWord.word.language === toWord.language
    )
      throw new BadRequestException('meaning_words_are_same');

    const globalToWord = await this.globalWordService.getOrCreate(toWord);

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

    await this.globalWordService.changeStatistics(
      globalToWord.id,
      'asUserMeaning',
      'increase',
      1
    );

    return createdUserMeaning;
  }

  async deleteUserMeaning(id: string, currentUser: User) {
    const foundUserMeaning = await this.userMeaningRepository.findOne({
      where: { id, user: { id: currentUser.id } },
      relations: { toWord: true }
    });

    if (!foundUserMeaning) throw new NotFoundException();

    try {
      const { affected } = await this.userMeaningRepository.delete(
        foundUserMeaning.id
      );
      if (!affected) throw new BadRequestException('cannot_delete');

      await this.globalWordService.changeStatistics(
        foundUserMeaning.toWord.id,
        'asUserMeaning',
        'decrease',
        1
      );
    } catch (err) {
      throw new BadRequestException('cannot_delete');
    }
  }
}
