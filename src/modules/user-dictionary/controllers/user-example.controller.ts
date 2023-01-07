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
import {
  AddUserExampleDto,
  DictionarySearchParams
} from '../../../shared/dtos';
import { UserExampleService } from '../services/user-example.service';

@Controller('user-examples')
@UseGuards(AuthGuard())
export class UserExampleController {
  constructor(private userExampleService: UserExampleService) {}

  @Get()
  getAllUserExamples(
    @GetCurrentUser() currentUser: User,
    @Query() query: DictionarySearchParams
  ) {
    return this.userExampleService.getAllUserExamples(query, currentUser);
  }

  @Post()
  async addUserExample(
    @GetCurrentUser() currentUser: User,
    @Body() body: AddUserExampleDto
  ) {
    return this.userExampleService.createUserExample(body, currentUser);
  }

  @Delete('/:id')
  async deleteUserExample(
    @GetCurrentUser() currentUser: User,
    @Param() param: { id: string },
    @Res() res: Response
  ): Promise<void> {
    await this.userExampleService.deleteUserExample(param.id, currentUser);

    res.status(HttpStatus.OK).send();
  }
}
