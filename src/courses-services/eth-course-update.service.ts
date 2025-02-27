import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { CurrencyExchangeService } from '../currency-exchange.service';

@Injectable()
export class EthUpdateCourseService {
  constructor(
    private readonly appService: AppService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  public async updateEthAed() {
    const [ask, bid] = await this.appService.getOffer('Eth', 'USD');
    const bidCourse = bid.price * 3.64;
    const askCourse = 1 / (ask.price * 3.7);
    await this.currencyExchangeService.updateCourse('ETH', 'AED', bidCourse);
    await this.currencyExchangeService.updateCourse('AED', 'ETH', askCourse);
  }

  public getTasks() {
    return [this.updateEthAed()];
  }
}
