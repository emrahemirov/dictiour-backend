import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_meanings' })
export class UserMeaning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userMeanings)
  @JoinColumn({ name: 'user-id' })
  user: User;

  @Column({ name: 'from-word-id' })
  fromWordId: string;

  @Column({ name: 'to-word-id' })
  toWordId: string;
}
