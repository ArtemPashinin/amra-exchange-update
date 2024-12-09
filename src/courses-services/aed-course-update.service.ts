import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { CurrencyExchangeService } from '../currency-exchange.service';

@Injectable()
export class AedUpdateCourseService {
  constructor(
    private readonly appService: AppService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  public async updateAedRub() {
    try {
      const [ask, bid] = await this.appService.getOffer('USDT', 'RUB');
      const bidCourse = 3.64;
      const askCourse = 3.7;
      await Promise.all([
        this.currencyExchangeService.updateCourse('USDT', 'AED', bidCourse),
        this.currencyExchangeService.updateCourse('AED', 'USDT', askCourse),
        this.currencyExchangeService.updateCourse('USDT', 'AED', bidCourse),
        this.currencyExchangeService.updateCourse('AED', 'USDT', askCourse),
      ]);
    } catch (err) {
      console.log('this');
    }
  }

  public getTasks() {
    return [this.updateAedRub()];
  }
}
