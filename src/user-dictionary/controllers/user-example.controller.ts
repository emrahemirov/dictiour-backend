import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetCurrentUser } from 'shared/decorators';
import { User } from 'shared/entities/user.entity';
import { AddUserExampleDto } from '../../shared/dtos';
import { UserExampleService } from '../services/user-example.service';

@Controller('user-examples')
@UseGuards(AuthGuard())
export class UserExampleController {
  constructor(private userExampleService: UserExampleService) {}

  @Post()
  async addUserExample(
    @GetCurrentUser() currentUser: User,
    @Body() body: AddUserExampleDto
  ) {
    return this.userExampleService.getOrCreateUserExample(body, currentUser);
  }

  @Delete('/:id')
  async deleteUserExample(
    @GetCurrentUser() currentUser: User,
    @Param() id: string,
    @Res() res: Response
  ): Promise<void> {
    await this.userExampleService.deleteUserExample(id, currentUser);

    res.status(HttpStatus.OK);
  }
}
