import { Controller, HttpStatus } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Roles } from 'shared/decorators/roles.decorator';
import { AddUserDto, SearchParamsDto } from 'shared/dtos';
import { UserRoles } from 'shared/enums';
import { RoleGuard } from 'shared/guards/role.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard(), RoleGuard)
@Roles(UserRoles.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(@Query() query: SearchParamsDto) {
    return this.userService.getAllUsers(query);
  }

  @Post()
  addUser(@Body() body: AddUserDto) {
    return this.userService.addUser(body);
  }

  @Delete('/:id')
  async deleteUser(@Param() param: { id: string }, @Res() res: Response) {
    await this.userService.deleteUser(param.id);

    res.status(HttpStatus.OK).send();
  }
}
