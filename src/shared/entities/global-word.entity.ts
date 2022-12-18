import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserExample } from './user-example.entity';
import { UserMeaning } from './user-meaning.entity';
import { UserWord } from './user-word.entity';

@Entity({ name: 'word' })
export class GlobalWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  language: string;

  @OneToMany(() => UserWord, (userWord) => userWord.word)
  userWords: UserWord[];

  @OneToMany(() => UserMeaning, (userMeaning) => userMeaning.toWord)
  meaningToWords: UserMeaning[];

  @OneToMany(() => UserExample, (userExample) => userExample.exampleWord)
  examples: UserExample[];
}
