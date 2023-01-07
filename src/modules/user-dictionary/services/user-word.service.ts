import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserWord } from 'entities';
import { AddUserWordDto, DictionarySearchParams } from '../../../shared/dtos';
import { GlobalWordService } from 'modules/global-word/global-word.service';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class UserWordService {
  constructor(
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
    private globalWordService: GlobalWordService
  ) {}

  async getAllUserWords(
    { language, page, search }: DictionarySearchParams,
    currentUser: User
  ) {
    const query = this.userWordRepository
      .createQueryBuilder('user_word')
      .leftJoin('user_word.word', 'global_word')
      .addSelect(['global_word'])
      .where('user_word.user_id = :id', {
        id: currentUser.id
      });

    if (language)
      query.andWhere('global_word.language = :language', {
        language
      });

    if (search)
      query.andWhere(`(LOWER(global_word.text) LIKE LOWER(:search))`, {
        search: `%${search}%`
      });

    const userWords = await query
      .skip((page - 1) * 30)
      .take(30)
      .getMany();

    return userWords;
  }

  async getUserWordWithId(id: string) {
    const foundUserWord = await this.userWordRepository.findOne({
      where: { id }
    });
    return foundUserWord;
  }

  async getOrCreateUserWord({ word }: AddUserWordDto, currentUser: User) {
    const globalWord = await this.globalWordService.getOrCreate(word);

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

    await this.globalWordService.changeStatistics(
      globalWord.id,
      'asUserWord',
      'increase',
      1
    );

    return createdUserWord;
  }

  async deleteUserWord(id: string, currentUser: User) {
    const foundUserWord = await this.userWordRepository.findOne({
      where: { id, user: { id: currentUser.id } },
      relations: { word: true }
    });

    if (!foundUserWord) throw new NotFoundException();

    try {
      const { affected } = await this.userWordRepository.delete(
        foundUserWord.id
      );
      if (!affected) throw new BadRequestException('cannot_delete');

      await this.globalWordService.changeStatistics(
        foundUserWord.word.id,
        'asUserWord',
        'decrease',
        1
      );
    } catch (err) {
      throw new BadRequestException('cannot_delete');
    }
  }
}
