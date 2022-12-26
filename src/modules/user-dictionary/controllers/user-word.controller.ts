import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetCurrentUser } from 'shared/decorators';
import { User } from 'entities/user.entity';
import { AddUserWordDto, SearchParamsDto } from '../../shared/dtos';
import { UserWordService } from '../services/user-word.service';

@Controller('user-words')
@UseGuards(AuthGuard())
export class UserWordController {
  constructor(private userWordService: UserWordService) {}

  @Get()
  getAllUserWords(
    @GetCurrentUser() currentUser: User,
    @Query() query: SearchParamsDto
  ) {
    return this.userWordService.getAllUserWords(query, currentUser);
  }

  @Post()
  async addUserWord(
    @GetCurrentUser() currentUser: User,
    @Body() body: AddUserWordDto
  ) {
    return this.userWordService.getOrCreateUserWord(body, currentUser);
  }

  @Delete('/:id')
  async deleteUserWord(
    @GetCurrentUser() currentUser: User,
    @Param() param: { id: string },
    @Res() res: Response
  ): Promise<void> {
    await this.userWordService.deleteUserWord(param.id, currentUser);

    res.status(HttpStatus.OK).send();
  }
}
