import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from './user.service';
import { Controller } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): User {
    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    } else {
      return user;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() user: Omit<User, 'id'>): User {
    return this.userService.create(user);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<Omit<User, 'id'>>,
  ): User {
    const user = this.userService.update(id, updateUserDto);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  remove(@Param('id', ParseIntPipe) id: number): void {
    const result = this.userService.remove(id);
    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
