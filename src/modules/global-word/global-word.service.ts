import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalWord } from 'entities';
import { Repository } from 'typeorm';
import { DictionarySearchParams, WordDto } from 'shared/dtos';

@Injectable()
export class GlobalWordService {
  constructor(
    @InjectRepository(GlobalWord)
    private readonly globalWordRepository: Repository<GlobalWord>
  ) {}

  async getAllWords({ page, language, search }: DictionarySearchParams) {
    const query = this.globalWordRepository.createQueryBuilder('global_word');

    if (language)
      query.where('global_word.language = :language', {
        language
      });

    if (search)
      query.andWhere(`(LOWER(global_word.text) LIKE LOWER(:search))`, {
        search: `%${search}%`
      });

    const words = await query
      .skip((page - 1) * 30)
      .limit(30)
      .getMany();

    return words;
  }

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
