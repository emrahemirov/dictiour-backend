import {
  BaseEntity,
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
import { UserRoles } from 'shared/enums';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 2 })
  role: UserRoles;

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
