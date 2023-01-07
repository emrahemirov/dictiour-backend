import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserExample, UserMeaning } from 'entities';
import {
  AddUserExampleDto,
  DictionarySearchParams
} from '../../../shared/dtos';
import { GlobalWordService } from 'modules/global-word/global-word.service';
import { UserMeaningService } from './user-meaning.service';

@Injectable()
export class UserExampleService {
  constructor(
    @InjectRepository(UserExample)
    private userExampleRepository: Repository<UserExample>,

    private userMeaningService: UserMeaningService,
    private globalWordService: GlobalWordService
  ) {}

  async getAllUserExamples(
    { page, userMeaningId, language, search }: DictionarySearchParams,
    currentUser: User
  ) {
    const query = this.userExampleRepository
      .createQueryBuilder('user_example')
      .leftJoin('user_example.exampleWord', 'global_word')
      .addSelect(['global_word'])
      .where('user_example.user_id = :id', {
        id: currentUser.id
      })
      .andWhere('user_example.meaning_word_id = :meaningWordId', {
        meaningWordId: userMeaningId
      });

    if (language)
      query.andWhere('global_word.language = :language', {
        language
      });

    if (search)
      query.andWhere(`(LOWER(global_word.text) LIKE LOWER(:search))`, {
        search: `%${search}%`
      });

    const userExamples = await query
      .skip((page - 1) * 30)
      .take(30)
      .getMany();

    return userExamples;
  }

  async createUserExample(
    { meaningId, example }: AddUserExampleDto,
    currentUser: User
  ) {
    const userMeaningWord = await this.userMeaningService.getUserMeaningWithId(
      meaningId
    );

    if (
      [
        userMeaningWord.toWord.text,
        userMeaningWord.fromWord.word.text
      ].includes(example.text) &&
      [
        userMeaningWord.toWord.language,
        userMeaningWord.fromWord.word.language
      ].includes(example.language)
    )
      throw new BadRequestException('example_words_are_same');

    const globalExampleWord = await this.globalWordService.getOrCreate(example);

    const foundUserExample = await this.userExampleRepository.findOne({
      where: {
        user: { id: currentUser.id },
        meaningWord: { id: userMeaningWord.id },
        exampleWord: { id: globalExampleWord.id }
      }
    });
    if (foundUserExample) return foundUserExample;

    const createdUserExample = await this.userExampleRepository
      .create({
        meaningWord: userMeaningWord,
        exampleWord: globalExampleWord,
        user: currentUser
      })
      .save();

    await this.globalWordService.changeStatistics(
      globalExampleWord.id,
      'asUserExample',
      'increase',
      1
    );

    return createdUserExample;
  }

  async deleteUserExample(id: string, currentUser: User) {
    const foundUserExample = await this.userExampleRepository.findOne({
      where: { id, user: { id: currentUser.id } },
      relations: { exampleWord: true }
    });

    if (!foundUserExample) throw new NotFoundException();

    try {
      const { affected } = await this.userExampleRepository.delete(
        foundUserExample.id
      );
      if (!affected) throw new BadRequestException('cannot_delete');

      await this.globalWordService.changeStatistics(
        foundUserExample.exampleWord.id,
        'asUserExample',
        'decrease',
        1
      );
    } catch (err) {
      throw new BadRequestException('cannot_delete');
    }
  }
}
