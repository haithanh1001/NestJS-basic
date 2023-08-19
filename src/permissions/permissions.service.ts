import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    let { apiPath, method } = createPermissionDto;
    let checkExist = await this.permissionModel.findOne({ apiPath, method });
    if (checkExist) {
      throw new BadRequestException(
        `Permission voi apiPath = ${apiPath}, method = ${method} da ton tai!`,
      );
    }
    let permission = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: permission._id,
      createAt: permission.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      //@ts-ignore: Unreachable code error
      .sort(sort as any)
      .select(projection)
      .populate(population)
      .exec();

    return {
      meta: {
        currentPage: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        totalPages: totalPages, //tổng số trang với điều kiện query
        totalItems: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found permission');
    }
    return await this.permissionModel.findById(_id);
  }

  async update(
    _id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('not found permission');
    }
    let result = await this.permissionModel.updateOne(
      { _id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return result;
  }

  async remove(_id: string, user: IUser) {
    await this.permissionModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.permissionModel.softDelete({ _id });
  }
}
