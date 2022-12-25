import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserExample } from 'shared/entities';
import { AddUserExampleDto } from '../../shared/dtos';
import { GlobalWordService } from 'global-word/global-word.service';
import { UserMeaningService } from './user-meaning.service';

@Injectable()
export class UserExampleService {
  constructor(
    @InjectRepository(UserExample)
    private userExampleRepository: Repository<UserExample>,

    private userMeaningService: UserMeaningService,
    private globalWordService: GlobalWordService
  ) {}

  async getOrCreateUserExample(
    { example, fromWord, toWord }: AddUserExampleDto,
    currentUser: User
  ) {
    if (
      [fromWord.text, toWord.text].includes(example.text) &&
      [fromWord.language, toWord.language].includes(example.language)
    )
      throw new BadRequestException('example_words_are_same');

    const userMeaningWord =
      await this.userMeaningService.getOrCreateUserMeaning(
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
