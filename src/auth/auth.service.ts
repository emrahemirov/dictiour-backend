import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'shared/entities/user.entity';
import { UserRepository } from 'shared/repositories/user.repository';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(body: SignUpDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(body.password, 8);

    return this.userRepository.createUser({ username: body.username, password: hashedPassword });
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { username, password } = signInDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('check your login credentials');

    const isPasswordTrue = await bcrypt.compare(password, user.password);
    if (!isPasswordTrue) throw new UnauthorizedException('check your login credentials');

    const payload: JwtPayload = { username };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }
}
