import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { CurrencyExchangeService } from '../currency-exchange.service';
import { Fee } from 'src/enums/fee.enum';

@Injectable()
export class RubUpdateCourseService {
  constructor(
    private readonly appService: AppService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  private async updateCurrencyPair(
    source: string,
    target: string,
    fee: number,
    isUsdtToUsd: boolean = false,
  ) {
    const [ask, bid] = await this.appService.getOffer(source, target);
    const bidPrice = bid.price - bid.price * fee;
    const askPrice = ask.price + ask.price * fee;
    if (isUsdtToUsd) {
      await this.currencyExchangeService.updateCourse('USD', target, bidPrice);
      await this.currencyExchangeService.updateCourse(
        target,
        'USD',
        1 / askPrice,
      );
    } else {
      await this.currencyExchangeService.updateCourse(source, target, bidPrice);
      await this.currencyExchangeService.updateCourse(
        target,
        source,
        1 / askPrice,
      );
    }
  }

  public async updateUsdtRub() {
    await this.updateCurrencyPair('USDT', 'RUB', Fee.USDT_RUB);
  }

  public async updateUsdRub() {
    await this.updateCurrencyPair('USDT', 'RUB', Fee.USDT_RUB, true);
  }

  public async updateEthRub() {
    await this.updateCurrencyPair('ETH', 'RUB', Fee.CRYPTO);
  }

  public async updateBtcRub() {
    await this.updateCurrencyPair('BTC', 'RUB', Fee.CRYPTO);
  }

  public async updateAedToRub() {
    const [ask, bid] = await this.appService.getOffer('USDT', 'RUB');
    const bidCourse = bid.price / 3.64;
    const askCourse = 1 / (ask.price / 3.7);
    // bidCourse > askCourse
    await this.currencyExchangeService.updateCourse('AED', 'RUB', bidCourse);
    await this.currencyExchangeService.updateCourse('RUB', 'AED', askCourse);
  }

  public getTasks() {
    return [
      this.updateUsdtRub(),
      this.updateEthRub(),
      this.updateUsdRub(),
      this.updateBtcRub(),
      this.updateAedToRub(),
    ];
  }
}
