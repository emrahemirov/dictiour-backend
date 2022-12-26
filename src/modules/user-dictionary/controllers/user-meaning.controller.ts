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
import { AddUserMeaningDto, SearchParamsDto } from '../../shared/dtos';
import { UserMeaningService } from '../services/user-meaning.service';

@Controller('user-meanings')
@UseGuards(AuthGuard())
export class UserMeaningController {
  constructor(private userMeaningService: UserMeaningService) {}

  @Get()
  getAllUserMeanings(
    @GetCurrentUser() currentUser: User,
    @Query() query: SearchParamsDto
  ) {
    return this.userMeaningService.getAllUserMeanings(query, currentUser);
  }

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
    @Param() param: { id: string },
    @Res() res: Response
  ): Promise<void> {
    await this.userMeaningService.deleteUserMeaning(param.id, currentUser);

    res.status(HttpStatus.OK).send();
  }
}
