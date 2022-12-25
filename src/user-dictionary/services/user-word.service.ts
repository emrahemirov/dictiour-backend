import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserWord } from 'shared/entities';
import { AddUserWordDto, SearchParamsDto } from '../../shared/dtos';
import { GlobalWordService } from 'global-word/global-word.service';

@Injectable()
export class UserWordService {
  constructor(
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
    private globalWordService: GlobalWordService
  ) {}

  async getUserWords(
    { language, page, search }: SearchParamsDto,
    currentUser: User
  ) {
    const query = this.userWordRepository
      .createQueryBuilder('user_word')
      .where('user_word.user.id = :id', {
        id: currentUser.id
      });

    if (language)
      query.andWhere('LOWER(user_word.word.language) = LOWER(:language)', {
        language
      });

    if (search)
      query.andWhere(`(LOWER(user_word.word.text) LIKE LOWER(:search)`, {
        search: `%${search}%`
      });

    const userWords = await query
      .offset((page - 1) * 30)
      .limit(30)
      .getMany();

    return userWords;
  }

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
}
