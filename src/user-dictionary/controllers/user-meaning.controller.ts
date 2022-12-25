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
import { AddUserMeaningDto } from '../../shared/dtos';
import { UserMeaningService } from '../services/user-meaning.service';

@Controller('user-meanings')
@UseGuards(AuthGuard())
export class UserMeaningController {
  constructor(private userMeaningService: UserMeaningService) {}

  @Post()
  async addUserMeaning(
    @GetCurrentUser() currentUser: User,
    @Body() body: AddUserMeaningDto
  ) {
    return this.userMeaningService.getOrCreateUserMeaning(body, currentUser);
  }

  @Delete('/:id')
  async deleteUserMeaning(
    @GetCurrentUser() currentUser: User,
    @Param() id: string,
    @Res() res: Response
  ): Promise<void> {
    await this.userMeaningService.deleteUserMeaning(id, currentUser);

    res.status(HttpStatus.OK);
  }
}
