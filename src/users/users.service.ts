import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { async } from 'rxjs';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  // create(createUserDto: CreateUserDto) {
  // console.log(createUserDto);

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  async create(createUserDto: CreateUserDto, user: IUser) {
    let { password, email } = createUserDto;
    let check = await this.userModel.findOne({ email });
    if (check) {
      throw new BadRequestException(
        `Email: ${email} da ton tai trong he thong! Vui long su dung email khac!`,
      );
    }
    const hashPassword = this.getHashPassword(password);
    let result = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return result;
  }

  async registerUserService(registerUserDto: RegisterUserDto) {
    let { password, email } = registerUserDto;
    let result = await this.userModel.findOne({ email: email });
    if (result) {
      throw new BadRequestException(
        `Email: ${email} da ton tai trong he thong! Vui long su dung email khac!`,
      );
    }
    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const hash_password = this.getHashPassword(password);
    const user = await this.userModel.create({
      ...registerUserDto,
      password: hash_password,
      //role: 'USER',
      role: userRole?._id,
    });
    return user;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      //@ts-ignore: Unreachable code error
      .sort(sort)
      .select('-password')
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found user';
    }
    let user = await this.userModel
      .findOne({
        _id: id,
      })
      .select('-password')
      .populate({
        path: 'role',
        select: {
          name: 1,
          _id: 1,
        },
      });
    return user;
    // let { password, ...data } = user._doc;
    // return data;
  }

  async findOneByUsername(username: string) {
    return await this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: 'role', select: { name: 1 } });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    let result = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return result;
  }

  async remove(id: string, user: IUser) {
    const foundUser = await this.userModel.findById(id);
    if (foundUser && foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Khong the xoa tai khoan admin!');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found user';
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.userModel.softDelete({ _id: id });
  }
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await (
      await this.userModel.findOne({ refreshToken })
    ).populate({
      path: 'role',
      select: { name: 1 },
    });
  };
}
