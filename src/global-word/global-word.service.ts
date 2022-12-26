import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalWord } from 'shared/entities';
import { Repository } from 'typeorm';
import { WordDto } from 'shared/dtos';

@Injectable()
export class GlobalWordService {
  constructor(
    @InjectRepository(GlobalWord)
    private readonly globalWordRepository: Repository<GlobalWord>
  ) {}

  async getOrCreate(word: WordDto): Promise<GlobalWord> {
    let foundGlobalWord = await this.globalWordRepository.findOne({
      where: { text: word.text, language: word.language }
    });

    if (foundGlobalWord) return foundGlobalWord;

    const createdGlobalWord = await this.globalWordRepository
      .create(word)
      .save();

    return createdGlobalWord;
  }

  async changeStatistics(
    id: string,
    as: 'asUserWord' | 'asUserMeaning' | 'asUserExample',
    type: 'increase' | 'decrease',
    count: number
  ) {
    await this.globalWordRepository
      .createQueryBuilder()
      .update(GlobalWord)
      .set({
        [as]: () =>
          `${as.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)} ${
            type === 'increase' ? '+' : '-'
          } ${count}`
      })
      .where('id = :id', { id })
      .execute();
  }
}
