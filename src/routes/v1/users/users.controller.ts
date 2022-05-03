import { Types } from 'mongoose';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import JwtAccessGuard from 'src/common/guards/jwt-access.guard';
import ParseObjectIdPipe from 'src/common/pipes/parse-object-id.pipe';
import { PaginationParamsInterface } from 'src/common/interfaces/pagination-params.interface';
import { PaginatedUsersInterface } from 'src/common/interfaces/paginatedEntity.interface';
import WrapResponseInterceptor from 'src/common/interceptors/wrap-response.interceptor';
import { User } from './schemas/users.schema';
import UsersService from './users.service';
import PaginationUtils from '../../../common/utils/pagination.utils';
import ResponseUtils from '../../../common/utils/response.utils';
import UserResponseEntity from '@v1/users/entity/user-response.entity';
import Serialize from 'src/common/decorators/serialization.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseInterceptors(WrapResponseInterceptor)
@ApiExtraModels(User)
@Controller()
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(User),
        },
      },
    },
    description: '200. Success. Returns a user',
  })
  @ApiNotFoundResponse({
    description: '404. NotFoundException. User was not found',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  @Serialize(UserResponseEntity)
  @UseGuards(JwtAccessGuard)
  async getById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<UserResponseEntity> {
    const foundUser = await this.usersService.getVerifiedUserById(id);

    if (!foundUser) {
      throw new NotFoundException('The user does not exist');
    }

    return ResponseUtils.success(
      'users',
      foundUser,
    );
  }

  @ApiOkResponse({
    description: '200. Success. Returns all users',
    schema: {
      type: 'object',
      properties: {
        data: {
          $ref: getSchemaPath(User),
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'string',
      },
    },
    description: '401. UnauthorizedException.',
  })
  @Get()
  @Serialize(UserResponseEntity)
  @UseGuards(JwtAccessGuard)
  async getAllVerifiedUsers(@Query() query: any): Promise<UserResponseEntity> {
    const paginationParams: PaginationParamsInterface | false = PaginationUtils.normalizeParams(query.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedUsers: PaginatedUsersInterface = await this.usersService.getAllVerifiedWithPagination(paginationParams);

    return ResponseUtils.success(
      'users',
      paginatedUsers.paginatedResult,
      {
        location: 'users',
        paginationParams,
        totalCount: paginatedUsers.totalCount,
      },
    );
  }
}
