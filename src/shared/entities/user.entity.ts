import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserExample } from './user-example.entity';
import { UserMeaning } from './user-meaning.entity';
import { UserWord } from './user-word.entity';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => UserWord, (userWord) => userWord.user)
  userWords: UserWord[];

  @OneToMany(() => UserMeaning, (userMeaning) => userMeaning.user)
  userMeanings: UserMeaning[];

  @OneToMany(() => UserExample, (userExample) => userExample.user)
  userExamples: UserExample[];

  @BeforeInsert()
  private async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 8);
  }
}
