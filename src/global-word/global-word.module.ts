import { Module } from '@nestjs/common';
import { GlobalWordService } from './global-word.service';
import { GlobalWordController } from './global-word.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalWord } from 'shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalWord])],
  providers: [GlobalWordService],
  controllers: [GlobalWordController]
})
export class GlobalWordModule {}
