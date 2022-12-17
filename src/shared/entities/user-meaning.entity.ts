import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { GlobalWord } from './global-word.entity';
import { UserExample } from './user-example.entity';
import { User } from './user.entity';

@Entity({ name: 'user_meaning' })
export class UserMeaning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userMeanings)
  @JoinColumn({ name: 'user-id' })
  user: User;

  @ManyToOne(() => GlobalWord, (globalWord) => globalWord.meaningFromWords)
  @JoinColumn({ name: 'from-word-id' })
  fromWord: GlobalWord;

  @ManyToOne(() => GlobalWord, (globalWord) => globalWord.meaningToWords)
  @JoinColumn({ name: 'to-word-id' })
  toWord: GlobalWord;

  @OneToMany(() => UserExample, (userExample) => userExample.meaningWord)
  userExamples: UserExample[];
}
