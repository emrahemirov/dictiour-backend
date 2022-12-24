import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
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
  language: string;

  @Column({ name: 'as_user_word', default: 0 })
  asUserWord: number;

  @Column({ name: 'as_user_meaning', default: 0 })
  asUserMeaning: number;

  @Column({ name: 'as_user_example', default: 0 })
  asUserExample: number;

  @OneToMany(() => UserWord, (userWord) => userWord.word, { eager: true })
  userWords: UserWord[];

  @OneToMany(() => UserMeaning, (userMeaning) => userMeaning.toWord, {
    eager: true
  })
  meaningToWords: UserMeaning[];

  @OneToMany(() => UserExample, (userExample) => userExample.exampleWord, {
    eager: true
  })
  examples: UserExample[];
}
