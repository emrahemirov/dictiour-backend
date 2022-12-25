import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserExample, UserMeaning, UserWord } from 'shared/entities';
import { AddUserWordDto } from '../../shared/dtos';
import { GlobalWordService } from 'global-word/global-word.service';

@Injectable()
export class UserWordService {
  constructor(
    @InjectRepository(UserWord)
    private userWordRepository: Repository<UserWord>,
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
