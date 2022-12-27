import { Languages } from 'shared/enums';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Report } from './report.entity';
import { UserExample } from './user-example.entity';
import { UserMeaning } from './user-meaning.entity';
import { UserWord } from './user-word.entity';

@Entity({ name: 'word' })
export class GlobalWord extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  language: Languages;

  @Column({ name: 'as_user_word', default: 0 })
  asUserWord: number;

  @Column({ name: 'as_user_meaning', default: 0 })
  asUserMeaning: number;

  @Column({ name: 'as_user_example', default: 0 })
  asUserExample: number;

  @OneToMany(() => UserWord, (userWord) => userWord.word)
  userWords: UserWord[];

  @OneToMany(() => UserMeaning, (userMeaning) => userMeaning.toWord)
  meaningToWords: UserMeaning[];

  @OneToMany(() => UserExample, (userExample) => userExample.exampleWord)
  examples: UserExample[];

  @OneToMany(() => Report, (report) => report.word)
  reports: Report[];
}
