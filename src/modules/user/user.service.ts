import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities';
import { AddUserDto, SearchParamsDto } from 'shared/dtos';
import { UserRoles } from 'shared/enums';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async getAllUsers({ page }: SearchParamsDto) {
    const users = this.userRepository.find({
      where: [{ role: UserRoles.USER }],
      skip: (page - 1) * 30,
      take: 30
    });

    return users;
  }

  async addUser({ username, password, role }: AddUserDto): Promise<User> {
    const user = this.userRepository.create({ username, password, role });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('user_already_exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteUser(id: string) {
    const { affected } = await this.userRepository.delete(id);

    if (!affected) throw new NotFoundException('not_found');
  }
}
