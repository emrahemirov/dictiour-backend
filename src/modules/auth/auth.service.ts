import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { IJwtPayload } from '../../shared/interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SignInDto, AddUserDto } from 'shared/dtos';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signUp({ username, password }: AddUserDto): Promise<User> {
    const user = this.userRepository.create({ username, password });

    try {
      return await this.userRepository.save(user);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException(
          'user with this account address already exists'
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const { username, password } = signInDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('check your login credentials');

    const isPasswordTrue = await bcrypt.compare(password, user.password);
    if (!isPasswordTrue)
      throw new UnauthorizedException('check your login credentials');

    const payload: IJwtPayload = { username };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken, username: user.username, role: user.role };
  }
}
