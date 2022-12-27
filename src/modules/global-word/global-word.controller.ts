import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { DictionarySearchParams } from 'shared/dtos';
import { GlobalWordService } from './global-word.service';

@Controller('global-words')
export class GlobalWordController {
  constructor(private readonly globalWordService: GlobalWordService) {}

  @Get()
  getAllWords(@Query() query: DictionarySearchParams) {
    return this.globalWordService.getAllWords(query);
  }
}
