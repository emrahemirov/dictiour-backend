import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_examples' })
export class UserExample {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userExamples)
  @JoinColumn({ name: 'user-id' })
  user: User;

  @Column({ name: 'meaning-id' })
  meaningId: string;

  @Column({ name: 'example-word-id' })
  exampleWordId: string;
}
