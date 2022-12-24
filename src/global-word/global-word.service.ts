import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalWord } from 'shared/entities';
import { Repository } from 'typeorm';
import { CreateGlobalWord } from './dtos/create-global-word.dto';

@Injectable()
export class GlobalWordService {
  constructor(
    @InjectRepository(GlobalWord)
    private readonly globalWordRepository: Repository<GlobalWord>
  ) {}

  async getOrCreate(
    word: CreateGlobalWord,
    as: 'asUserWord' | 'asUserMeaning' | 'asUserExample'
  ): Promise<GlobalWord> {
    let foundGlobalWord = await this.globalWordRepository.findOne({
      where: { text: word.text, language: word.language }
    });

    if (foundGlobalWord) {
      const updatedGlobalWord = await this.globalWordRepository.save({
        ...foundGlobalWord,
        [as]: foundGlobalWord[as]++
      });

      return updatedGlobalWord;
    }

    const createdGlobalWord = await this.globalWordRepository
      .create(word)
      .save();

    return createdGlobalWord;
  }

  async decreaseStatistics(
    id: string,
    as: 'asUserWord' | 'asUserMeaning' | 'asUserExample'
  ) {
    await this.globalWordRepository
      .createQueryBuilder()
      .update(GlobalWord)
      .set({
        [as]: () => `${as} - 1`
      })
      .where('id = :id', { id })
      .execute();
  }
}
