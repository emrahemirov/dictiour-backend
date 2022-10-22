import { TypeOrmExModule } from '@database/typeorm-ex.module';
import { Module } from '@nestjs/common';
import { UserRepository } from '@user/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
