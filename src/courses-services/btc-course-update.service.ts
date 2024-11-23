import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { CurrencyExchangeService } from '../currency-exchange.service';

@Injectable()
export class BtcUpdateCourseService {
  constructor(
    private readonly appService: AppService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  public async updateBtcAed() {
    try {
      const [ask, bid] = await this.appService.getOffer('BTC', 'USD');
      const bidCourse = bid.price * 3.67;
      const askCourse = 1 / (ask.price * 3.67);
      await this.currencyExchangeService.updateCourse('BTC', 'AED', bidCourse);
      await this.currencyExchangeService.updateCourse('AED', 'BTC', askCourse);
    } catch (err) {
      console.log('this');
    }
  }

  public getTasks() {
    return [this.updateBtcAed()];
  }
}
