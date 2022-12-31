import {
  BaseEntity,
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
export class UserExample extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userExamples, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserMeaning, (userMeaning) => userMeaning.userExamples, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'meaning_word_id' })
  meaningWord: UserMeaning;

  @ManyToOne(() => GlobalWord, (globalWord) => globalWord.examples, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'example_word_id' })
  exampleWord: GlobalWord;
}
