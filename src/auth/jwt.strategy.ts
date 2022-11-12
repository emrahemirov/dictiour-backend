import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'shared/entities/user.entity';
import { UserRepository } from 'shared/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      secretOrKey: 'LT71uV}}%o!5Mw-iA0H]*k,:B}_muP_v',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const user: User = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
