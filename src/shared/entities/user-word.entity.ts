import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { GlobalWord } from './global-word.entity';

@Entity({ name: 'user_word' })
export class UserWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userWords)
  @JoinColumn({ name: 'user-id' })
  user: User;

  @ManyToOne(() => GlobalWord, (word) => word.userWords)
  @JoinColumn({ name: 'word-id' })
  word: GlobalWord;
}
