import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  ParsedRequest,
  Override,
} from '@rettechnologys/crud';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  params: {
    companyId: {
      field: 'companyId',
      type: 'number',
    },
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  query: {
    softDelete: true,
    join: {
      company: {
        exclude: ['description'],
      },
      'company.projects': {
        //alias: 'pr',
        exclude: ['description'],
      },
      profile: {
        alias: 'profile',
        eager: true,
        exclude: ['updatedAt'],
      },
    },
  },
})
@ApiTags('users')
@Controller('/companies/:companyId/users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override('getManyBase')
  async getAll(@ParsedRequest() req: CrudRequest) {
    const res = await this.service.getMany(req);
    console.log('getAll', res);
    return res;
  }

  @Override('getOneBase')
  async getOne(@ParsedRequest() req: CrudRequest) {
    const res = await this.service.getOne(req, true);
    console.log('getOne', res);
    return res;
  }
}
