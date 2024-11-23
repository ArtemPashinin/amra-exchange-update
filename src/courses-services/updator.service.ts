import { Injectable } from '@nestjs/common';
import { RubUpdateCourseService } from './rub-course-update.service';
import { Cron } from '@nestjs/schedule';
import { BtcUpdateCourseService } from './btc-course-update.service';
import { EthUpdateCourseService } from './eth-course-update.service';
import { AedUpdateCourseService } from './aed-course-update.service';

@Injectable()
export class UpdatorService {
  constructor(
    private readonly rubUpdateCourseService: RubUpdateCourseService,
    private readonly btcUpdateCourseService: BtcUpdateCourseService,
    private readonly ethUpdateCourseService: EthUpdateCourseService,
    private readonly aedUpdateCourseService: AedUpdateCourseService,
  ) {}

  @Cron('*/30 * * * * *')
  public async updateAllCurrencies() {
    console.log('called');
    await Promise.all([
      this.rubUpdateCourseService.getTasks(),
      this.btcUpdateCourseService.getTasks(),
      this.ethUpdateCourseService.getTasks(),
      this.aedUpdateCourseService.getTasks(),
    ]);
  }
}
