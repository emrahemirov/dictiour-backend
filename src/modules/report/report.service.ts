import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalWord, Report } from 'entities';
import { SearchParamsDto } from 'shared/dtos';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(GlobalWord)
    private readonly globalWordRepository: Repository<GlobalWord>
  ) {}

  async addReport({ globalWordId }: { globalWordId: string }) {
    const foundGlobalWord = await this.globalWordRepository.findOne({
      where: { id: globalWordId }
    });

    if (!foundGlobalWord) throw new NotFoundException('not_found');

    const insertedReport = await this.reportRepository
      .create({ word: foundGlobalWord })
      .save();

    return insertedReport;
  }

  getAllReports({ page }: SearchParamsDto) {
    return this.reportRepository
      .createQueryBuilder()
      .leftJoin('report.word', 'global_word')
      .addSelect(['global_word.text', 'global_word.language'])
      .skip((page - 1) * 30)
      .limit(30)
      .getMany();
  }

  async approveReport(id: string) {
    const foundReport = await this.reportRepository.findOne({ where: { id } });
    if (!foundReport) throw new NotFoundException('not_found');

    const { affected } = await this.globalWordRepository.delete(
      foundReport.word.id
    );
    if (!affected) throw new NotFoundException('cannot_delete');
  }

  async rejectReport(id: string) {
    const { affected } = await this.reportRepository.delete(id);
    if (!affected) throw new NotFoundException('not_found');
  }
}
