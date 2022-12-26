import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { GlobalWord } from './global-word.entity';

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GlobalWord, (word) => word.userWords, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'word_id' })
  word: GlobalWord;
}
