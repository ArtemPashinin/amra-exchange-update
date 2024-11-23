import { Injectable } from '@nestjs/common';
import { RubUpdateCourseService } from './rub-course-update.service';
import { Cron } from '@nestjs/schedule';
import { BtcUpdateCourseService } from './btc-course-update.service';
import { EthUpdateCourseService } from './eth-course-update.service';
import { AedUpdateCourseService } from './aed-course-update.service';
import { TonUpdateCourseService } from './ton-course-update.service';

@Injectable()
export class UpdatorService {
  constructor(
    private readonly rubUpdateCourseService: RubUpdateCourseService,
    private readonly btcUpdateCourseService: BtcUpdateCourseService,
    private readonly ethUpdateCourseService: EthUpdateCourseService,
    private readonly aedUpdateCourseService: AedUpdateCourseService,
    private readonly tonUpdateCourseService: TonUpdateCourseService,
  ) {}

<<<<<<< HEAD
  @Cron('*/5 * * * * *')
=======
  @Cron('*/30 * * * * *')
>>>>>>> ffad95726ced2728c3426d1d6ee17427662e5b66
  public async updateAllCurrencies() {
    await Promise.all([
      this.rubUpdateCourseService.getTasks(),
      this.btcUpdateCourseService.getTasks(),
      this.ethUpdateCourseService.getTasks(),
      this.aedUpdateCourseService.getTasks(),
      this.tonUpdateCourseService.getTasks(),
    ]);
  }
}
