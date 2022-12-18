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
    const globalWord = await this.globalWordService.getOrCreate(word);

    const foundUserWord = await this.userWordRepository.findOne({
      where: { user: currentUser, word: globalWord }
    });
    if (foundUserWord) return foundUserWord;

    const userWordEntity = this.userWordRepository.create({
      word: globalWord,
      user: currentUser
    });

    const createdUserWord = await this.userWordRepository.save(userWordEntity);

    return createdUserWord;
  }

  async getOrCreateUserMeaning(
    { fromWord, toWord }: AddUserMeaningDto,
    currentUser: User
  ) {
    const userWord = await this.getOrCreateUserWord(
      { word: fromWord },
      currentUser
    );
    const globalToWord = await this.globalWordService.getOrCreate(toWord);

    if (userWord.word.id === globalToWord.id)
      throw new BadRequestException('meaning_words_are_same');

    const foundUserMeaning = await this.userMeaningRepository.findOne({
      where: {
        user: currentUser,
        fromWord: userWord,
        toWord: globalToWord
      }
    });

    if (foundUserMeaning) return foundUserMeaning;

    const userMeaningEntity = this.userMeaningRepository.create({
      fromWord: userWord,
      toWord: globalToWord,
      user: currentUser
    });
    const createdUserMeaning = await this.userMeaningRepository.save(
      userMeaningEntity
    );

    return createdUserMeaning;
  }

  async getOrCreateUserExample(
    { example, fromWord, toWord }: AddUserExampleDto,
    currentUser: User
  ) {
    const globalExampleWord = await this.globalWordService.getOrCreate(example);
    const userMeaningWord = await this.getOrCreateUserMeaning(
      { fromWord, toWord },
      currentUser
    );

    if (
      [userMeaningWord.fromWord.id, userMeaningWord.toWord.id].includes(
        globalExampleWord.id
      )
    )
      throw new BadRequestException('words_are_same');

    const foundUserExample = await this.userExampleRepository.findOne({
      where: {
        user: currentUser,
        meaningWord: userMeaningWord,
        exampleWord: globalExampleWord
      }
    });
    if (foundUserExample) return foundUserExample;

    const userExampleEntity = this.userExampleRepository.create({
      meaningWord: userMeaningWord,
      exampleWord: globalExampleWord,
      user: currentUser
    });
    const createdUserExample = await this.userExampleRepository.save(
      userExampleEntity
    );

    return createdUserExample;
  }

  async deleteUserWord(id: string, currentUser: User) {
    const { affected } = await this.userWordRepository.delete({
      id: id,
      user: currentUser
    });

    if (affected === 0) throw new NotFoundException();
  }

  async deleteUserMeaning(id: string, currentUser: User) {
    const { affected } = await this.userMeaningRepository.delete({
      id: id,
      user: currentUser
    });

    if (affected === 0) throw new NotFoundException();
  }

  async deleteUserExample(id: string, currentUser: User) {
    const { affected } = await this.userExampleRepository.delete({
      id: id,
      user: currentUser
    });

    if (affected === 0) throw new NotFoundException();
  }
}
