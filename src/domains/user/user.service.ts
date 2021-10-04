import { Injectable, NotFoundException } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  public async create({ password, ...rest }: CreateUserDto) {
    return await this.prisma.user.create({
      data: { password: hashSync(password, 10), ...rest },
    });
  }

  public async findAll() {
    return this.prisma.user.findMany();
  }

  async findOneOrFail(id: string) {
    try {
      return await this.prisma.user.findFirst({ where: { id: +id } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByEmailOrFail(email: string) {
    try {
      return await this.prisma.user.findFirst({ where: { email } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  public async update({
    id,
    updateUserDto,
  }: {
    id: string;
    updateUserDto: UpdateUserDto;
  }) {
    return this.prisma.user.update({ where: { id: +id }, data: updateUserDto });
  }

  public async remove(id: string) {
    await this.findOneOrFail(id);
    return await this.prisma.user.delete({ where: { id: +id } });
  }
}
