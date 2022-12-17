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

  async getOrCreate(word: CreateGlobalWord): Promise<GlobalWord> {
    const foundGlobalWord = await this.globalWordRepository.findOne({
      where: { text: word.text, language: word.language }
    });

    if (foundGlobalWord) return foundGlobalWord;

    const globalWordEntity = this.globalWordRepository.create(word);
    const createdGlobalWord = await this.globalWordRepository.save(
      globalWordEntity
    );

    return createdGlobalWord;
  }
}
