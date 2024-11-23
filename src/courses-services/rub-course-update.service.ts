import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { CurrencyExchangeService } from '../currency-exchange.service';

@Injectable()
export class RubUpdateCourseService {
  constructor(
    private readonly appService: AppService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  private async updateCurrencyPair(
    source: string,
    target: string,
    isUsdtToUsd: boolean = false,
  ) {
    const [ask, bid] = await this.appService.getOffer(source, target);

    if (isUsdtToUsd) {
      await this.currencyExchangeService.updateCourse('USD', target, bid.price);
      await this.currencyExchangeService.updateCourse(
        target,
        'USD',
        1 / ask.price,
      );
    } else {
      if(source === 'USDT' || target === 'USDT') console.log(ask)
      await this.currencyExchangeService.updateCourse(
        source,
        target,
        bid.price,
      );
      await this.currencyExchangeService.updateCourse(
        target,
        source,
        1 / ask.price,
      );
    }
  }

  public async updateUsdtRub() {
    await this.updateCurrencyPair('USDT', 'RUB', true);
  }

  public async updateUsdRub() {
    await this.updateCurrencyPair('USDT', 'USD', true);
  }

  public async updateEthRub() {
    await this.updateCurrencyPair('ETH', 'RUB');
  }

  public async updateBtcRub() {
    await this.updateCurrencyPair('BTC', 'RUB');
  }

  public async updateAedToRub() {
    const [ask, bid] = await this.appService.getOffer('USDT', 'RUB');
    const bidCourse = bid.price / 3.67;
    const askCourse = 1 / (ask.price / 3.67);
    await this.currencyExchangeService.updateCourse('AED', 'RUB', bidCourse);
    await this.currencyExchangeService.updateCourse('RUB', 'AED', askCourse);
  }

  public getTasks() {
    return [
      this.updateUsdtRub(),
      this.updateEthRub(),
      this.updateUsdtRub(),
      this.updateBtcRub(),
      this.updateAedToRub(),
    ];
  }
}
