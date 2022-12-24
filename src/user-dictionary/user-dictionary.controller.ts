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
import { GetCurrentUser } from 'shared/decorators/current-user.decorator';
import { User } from 'shared/entities/user.entity';
import { AddUserExampleDto, AddUserWordDto, AddUserMeaningDto } from './dtos';
import { UserDictionaryService } from './user-dictionary.service';

@Controller('user-dictionary')
@UseGuards(AuthGuard())
export class UserDictionaryController {
  constructor(private userDictionaryService: UserDictionaryService) {}

  @Post('/words')
  async addUserWord(
    @GetCurrentUser() currentUser: User,
    @Body() body: AddUserWordDto
  ) {
    return this.userDictionaryService.getOrCreateUserWord(body, currentUser);
  }

  @Delete('/words/:id')
  async deleteUserWord(
    @GetCurrentUser() currentUser: User,
    @Param() id: string,
    @Res() res: Response
  ): Promise<void> {
    await this.userDictionaryService.deleteUserWord(id, currentUser);

    res.status(HttpStatus.OK);
  }

  @Post('/meanings')
  async addUserMeaning(
    @GetCurrentUser() currentUser: User,
    @Body() body: AddUserMeaningDto
  ) {
    return this.userDictionaryService.getOrCreateUserMeaning(body, currentUser);
  }

  @Delete('/meanings/:id')
  async deleteUserMeaning(
    @GetCurrentUser() currentUser: User,
    @Param() id: string,
    @Res() res: Response
  ): Promise<void> {
    await this.userDictionaryService.deleteUserMeaning(id, currentUser);

    res.status(HttpStatus.OK);
  }

  @Post('/examples')
  async addUserExample(
    @GetCurrentUser() currentUser: User,
    @Body() body: AddUserExampleDto
  ) {
    return this.userDictionaryService.getOrCreateUserExample(body, currentUser);
  }

  @Delete('/examples/:id')
  async deleteUserExample(
    @GetCurrentUser() currentUser: User,
    @Param() id: string,
    @Res() res: Response
  ): Promise<void> {
    await this.userDictionaryService.deleteUserExample(id, currentUser);

    res.status(HttpStatus.OK);
  }
}
