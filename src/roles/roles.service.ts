import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    //khong dung prop require : true
    let roleName = createRoleDto.name;
    let checkExist = await this.roleModel.findOne({ name: roleName });
    if (checkExist) {
      throw new BadRequestException(`Role voi name = ${roleName} da ton tai!`);
    }
    let data = await this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: data?._id,
      createAt: data?.createdAt,
    };
    //cach dung prop unique : true
    // try {
    //   let data = await this.roleModel.create({
    //     ...createRoleDto,
    //     createdBy: {
    //       _id: user._id,
    //       email: user.email,
    //     },
    //   });
    //   return {
    //     _id: data._id,
    //     createAt: data.createdAt,
    //   };
    // } catch (error) {
    //   throw new BadRequestException(`Role voi name = ${roleName} da ton tai!`);
    // }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      //@ts-ignore: Unreachable code error
      .sort(sort)
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
      throw new BadRequestException('Id khong hop le');
    }
    return (await this.roleModel.findOne({ _id })).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    try {
      return await this.roleModel.updateOne(
        { _id: id },
        {
          ...updateRoleDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
    } catch (error) {
      throw new BadRequestException(
        `Role voi name = ${updateRoleDto.name} da ton tai!`,
      );
    }

    // let newName = updateRoleDto.name;
    // let checkExist = await this.roleModel.findOne({
    //   _id: { $ne: id },
    //   name: newName,
    // });
    // if (checkExist) {
    //   throw new BadRequestException(
    //     'Ten role cap nhat da ton tai, vui long thu ten khac!',
    //   );
    // }
    // return await this.roleModel.updateOne(
    //   { _id: id },
    //   {
    //     ...updateRoleDto,
    //     updatedBy: {
    //       _id: user._id,
    //       email: user.email,
    //     },
    //   },
    // );
  }

  async remove(_id: string, user: IUser) {
    const foundRole = await this.roleModel.findById(_id);
    if (foundRole.name === 'ADMIN') {
      throw new BadRequestException('Khong the xoa role ADMIN');
    }
    await this.roleModel.updateOne(
      {
        _id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.roleModel.softDelete({ _id });
  }
}
