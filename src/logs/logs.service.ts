import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { FilterLogsDto } from './dto/filter-logs.dto';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(dto: CreateLogDto): Promise<Log> {
    return this.logModel.create(dto);
  }

  async getLogs(filter: FilterLogsDto): Promise<Log[]> {
    const query: {
      type?: string;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {};

    if (filter.type) {
      query.type = filter.type;
    }

    if (filter.fromDate || filter.toDate) {
      query.createdAt = {};
      if (filter.fromDate) query.createdAt.$gte = new Date(filter.fromDate);
      if (filter.toDate) query.createdAt.$lte = new Date(filter.toDate);
    }

    return this.logModel.find(query).sort({ createdAt: -1 }).exec();
  }
}
