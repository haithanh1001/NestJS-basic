import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { Types } from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    let { url, companyId, jobId } = createUserCvDto;
    let resume = await this.resumeModel.create({
      url: url,
      companyId: companyId,
      jobId: jobId,
      email: user.email,
      userId: user._id,
      status: 'PENDING',
      createdBy: {
        _id: user._id,
        email: user.email,
      },
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
    });
    return {
      _id: resume?._id,
      createdAt: resume?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      //@ts-ignore: Unreachable code error
      .sort(sort as any)
      .select(projection as any)
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
      return `Id is not mongo id`;
    }
    return await this.resumeModel.findOne({ _id: id });
  }

  async update(_id: string, status: string, user: IUser) {
    let result = await this.resumeModel.updateOne(
      {
        _id,
      },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );
    return result;

    // let resume = await this.resumeModel.findOne({ _id: id });
    // let historyArray = (await resume).history;
    // let detail: any = {
    //   status: status,
    //   updatedAt: new Date(),
    //   updatedBy: {
    //     _id: user._id,
    //     email: user.email,
    //   },
    // };
    // historyArray.push(detail);
    // let result = await this.resumeModel.updateOne(
    //   { _id: id },
    //   {
    //     status: status,
    //     history: historyArray,
    //     updatedBy: {
    //       _id: user._id,
    //       email: user.email,
    //     },
    //   },
    // );
    // return result;
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user._id,
        },
      },
    );
    return await this.resumeModel.softDelete({ _id: id });
  }
  async getAllResumesByUser(user: IUser) {
    return await this.resumeModel
      .find({ userId: user._id })
      .sort('-createdAt')
      .populate([
        {
          path: 'companyId',
          select: { name: 1 },
        },
        {
          path: 'jobId',
          select: { name: 1 },
        },
      ]);
  }
}
