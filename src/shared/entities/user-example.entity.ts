import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { GlobalWord } from './global-word.entity';
import { UserMeaning } from './user-meaning.entity';
import { User } from './user.entity';

@Entity({ name: 'user_example' })
export class UserExample {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userExamples)
  @JoinColumn({ name: 'user-id' })
  user: User;

  @ManyToOne(() => UserMeaning, (userMeaning) => userMeaning.userExamples)
  @JoinColumn({ name: 'meaning-id' })
  meaningWord: UserMeaning;

  @ManyToOne(() => GlobalWord, (globalWord) => globalWord.examples)
  @JoinColumn({ name: 'example-word-id' })
  exampleWord: GlobalWord;
}
