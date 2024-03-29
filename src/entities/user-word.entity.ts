import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user.entity';
import { GlobalWord } from './global-word.entity';
import { UserMeaning } from './user-meaning.entity';

@Entity({ name: 'user_word' })
export class UserWord extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userWords, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => GlobalWord, (word) => word.userWords, {
    onDelete: 'CASCADE',
    eager: true
  })
  @JoinColumn({ name: 'word_id' })
  word: GlobalWord;

  @OneToMany(() => UserMeaning, (userMeaning) => userMeaning.fromWord)
  meaningFromWords: UserMeaning[];
}
