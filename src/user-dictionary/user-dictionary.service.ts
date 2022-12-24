import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserExample, UserMeaning, UserWord } from 'shared/entities';
import { AddUserExampleDto, AddUserWordDto, AddUserMeaningDto } from './dtos';
import { GlobalWordService } from 'global-word/global-word.service';

@Injectable()
export class UserDictionaryService {
  constructor(
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
    @InjectRepository(UserMeaning)
    private userMeaningRepository: Repository<UserMeaning>,
    @InjectRepository(UserExample)
    private userExampleRepository: Repository<UserExample>,
    private globalWordService: GlobalWordService
  ) {}

  async getOrCreateUserWord({ word }: AddUserWordDto, currentUser: User) {
    const globalWord = await this.globalWordService.getOrCreate(
      word,
      'asUserWord'
    );

    const foundUserWord = await this.userWordRepository.findOne({
      where: { user: { id: currentUser.id }, word: { id: globalWord.id } }
    });
    if (foundUserWord) return foundUserWord;

    const createdUserWord = await this.userWordRepository
      .create({
        word: globalWord,
        user: currentUser
      })
      .save();

    return createdUserWord;
  }

  async getOrCreateUserMeaning(
    { fromWord, toWord }: AddUserMeaningDto,
    currentUser: User
  ) {
    if (fromWord.text === toWord.text && fromWord.language === toWord.language)
      throw new BadRequestException('meaning_words_are_same');

    const userWord = await this.getOrCreateUserWord(
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

  async getOrCreateUserExample(
    { example, fromWord, toWord }: AddUserExampleDto,
    currentUser: User
  ) {
    if (
      [fromWord.text, toWord.text].includes(example.text) &&
      [fromWord.language, toWord.language].includes(example.language)
    )
      throw new BadRequestException('example_words_are_same');

    const userMeaningWord = await this.getOrCreateUserMeaning(
      { fromWord, toWord },
      currentUser
    );
    const globalExampleWord = await this.globalWordService.getOrCreate(
      example,
      'asUserExample'
    );

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

    return createdUserExample;
  }

  async deleteUserWord(id: string, currentUser: User) {
    const foundUserWord = await this.userWordRepository.findOne({
      where: { id, user: { id: currentUser.id } }
    });

    if (!foundUserWord) throw new NotFoundException();

    this.globalWordService.decreaseStatistics(
      foundUserWord.word.id,
      'asUserWord'
    );
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

  async deleteUserExample(id: string, currentUser: User) {
    const foundUserExample = await this.userExampleRepository.findOne({
      where: { id, user: { id: currentUser.id } }
    });

    if (!foundUserExample) throw new NotFoundException();

    this.globalWordService.decreaseStatistics(
      foundUserExample.exampleWord.id,
      'asUserExample'
    );
  }
}
