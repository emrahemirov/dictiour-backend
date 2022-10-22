import { CustomRepository } from '@database/typeorm-ex.decorator';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '@user/dtos/create-user.dto';
import { User } from '@user/entities/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { accountAddress } = createUserDto;

    const user = this.create({ accountAddress });

    try {
      return await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('user with this account address already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}