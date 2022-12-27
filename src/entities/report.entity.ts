import {
  BaseEntity,
  Column,
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

  @ManyToOne(() => GlobalWord, (word) => word.reports, {
    onDelete: 'CASCADE',
    eager: true
  })
  @JoinColumn({ name: 'word_id' })
  word: GlobalWord;

  @Column({ default: 0 })
  count: number;
}
