import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'words' })
export class GlobalWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  word: string;

  @Column()
  language: string;
}
