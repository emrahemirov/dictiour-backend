import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { GlobalWord } from './global-word.entity';
import { UserExample } from './user-example.entity';
import { UserWord } from './user-word.entity';
import { User } from './user.entity';

@Entity({ name: 'user_meaning' })
export class UserMeaning extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userMeanings, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserWord, (userWord) => userWord.meaningFromWords, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'from_word_id' })
  fromWord: UserWord;

  @ManyToOne(() => GlobalWord, (globalWord) => globalWord.meaningToWords, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'to_word_id' })
  toWord: GlobalWord;

  @OneToMany(() => UserExample, (userExample) => userExample.meaningWord)
  userExamples: UserExample[];
}
